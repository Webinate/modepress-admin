import * as React from 'react';
import { IRootState } from '../store';
import { connectWrapper, returntypeof } from '../utils/decorators';
import { push } from 'react-router-redux';
import { createVolume, getVolumes, getVolume, deleteVolumes, upload, openDirectory, deleteFiles, editFile, editVolume } from '../store/media/actions';
import { MediaNavigator } from '../components/media/media-navigator';
import { GetAllOptions } from '../../../../src/lib-frontend/volumes';
import { SortTypes } from '../components/media/directory-view';
import { SortOrder } from '../components/media/volumes';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { BreadCrumb } from '../components/media/bread-crumb';

// Map state to props
const mapStateToProps = ( state: IRootState, ownProps: any ) => ( {
  user: state.authentication.user,
  app: state.app,
  media: state.media,
  open: ownProps.open,
  onCancel: ownProps.onCancel as () => void
} );

// Map actions to props (This binds the actions to the dispatch fucntion)
const dispatchToProps = {
  push: push,
  createVolume,
  getVolumes,
  getVolume,
  openDirectory,
  deleteVolumes,
  upload,
  deleteFiles,
  editFile,
  editVolume
}

const stateProps = returntypeof( mapStateToProps );
type Props = typeof stateProps & typeof dispatchToProps;
type State = {
  selectedUid: string | null;
};

@connectWrapper( mapStateToProps, dispatchToProps )
export class MediaModal extends React.Component<Props, State> {

  constructor( props: Props ) {
    super( props );
    this.state = {
      selectedUid: null
    };
  }

  private onDelete( volumeId?: string ) {
    const selectedUid = this.state.selectedUid!;

    if ( volumeId ) {
      this.setState( { selectedUid: null }, () => {
        this.props.deleteFiles( volumeId, [ selectedUid ] );
      } )
    }
    else {
      this.setState( { selectedUid: null }, () => {
        this.props.deleteVolumes( [ selectedUid ] );
      } );
    }
  }

  private onSort( sort: SortTypes, direction: SortOrder, volumeId: string | null ) {
    if ( volumeId )
      this.props.openDirectory( volumeId, { sort: sort, sortOrder: direction } );
    else
      this.props.getVolumes( { sort: sort, sortOrder: direction } );
  }

  render() {
    const activeDir = this.props.media.selected;
    const selectedUids = this.state.selectedUid ? [ this.state.selectedUid ] : [];
    let navigator: JSX.Element | null = null;
    const style: React.CSSProperties = {
      width: '100%',
      height: '600px'
    };

    if ( activeDir ) {
      navigator = <MediaNavigator
        multiselect={false}
        filesFilters={this.props.media.filesFilters}
        selectedIds={selectedUids}
        files={this.props.media.filesPage}
        style={style}
        onRename={( newName, id ) => this.props.editFile( activeDir._id, id, { name: newName } )}
        onDelete={() => this.onDelete( activeDir._id )}
        onSort={( sort, dir ) => this.onSort( sort, dir, activeDir._id )}
        onUploadFiles={files => { this.props.upload( activeDir._id, files ) }}
        activeVolume={this.props.media.selected}
        activeVolumeId={activeDir._id}
        loading={this.props.media.busy}
        onSelectionChanged={selection => this.setState( { selectedUid: selection[ selection.length - 1 ] } )}
        openDirectory={( id, options ) => this.props.openDirectory( id, options )}
      />
    }
    else {
      navigator = <MediaNavigator
        multiselect={false}
        volumeFilters={this.props.media.volumeFilters}
        selectedIds={selectedUids}
        style={style}
        onDelete={() => this.onDelete()}
        onRename={( newName, id ) => this.props.editVolume( id, { name: newName } )}
        onSort={( sort, dir ) => this.onSort( sort, dir, null )}
        openVolume={volume => this.setState( { selectedUid: null }, () => this.props.openDirectory( volume ) )}
        onSelectionChanged={volumes => this.setState( { selectedUid: volumes[ volumes.length - 1 ] } )}
        loading={this.props.media.busy}
        volumes={this.props.media.volumePage}
        getVolumes={( options: Partial<GetAllOptions> ) => this.props.getVolumes( options )}
      />;
    }

    return (
      <Dialog
        open={this.props.open}
        scroll="paper"
        maxWidth={false}
        PaperProps={{ style: { maxWidth: '70%' } }}
      >
        <DialogContent>
          {activeDir ? <BreadCrumb
            volume={activeDir}
            onVolumeSelected={() => this.props.getVolumes( { index: 0, search: '' } )}
          /> : undefined}
          {navigator}
        </DialogContent>
        <DialogActions>
          <Button
            id="mt-media-cancel-btn"
            onClick={e => this.props.onCancel()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!activeDir || !this.state.selectedUid}
            id="mt-media-confirm-btn"
            onClick={e => this.props.onCancel()}
            color="primary"
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}