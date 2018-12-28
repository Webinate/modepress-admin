import * as React from 'react';
import { default as styled } from '../../theme/styled';
import { IPost, IUserEntry, IDocument, IDraft, ITemplate } from 'modepress';
import Avatar from '@material-ui/core/Avatar';
import { generateAvatarPic } from '../../utils/component-utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as format from 'date-fns/format';
import theme from '../../theme/mui-theme';

export type Props = {
  post: IPost<'client'>;
  id?: string;
  loading: boolean;
  renderComments?: () => undefined | null | JSX.Element;
}

type State = {
  activeZone: string;
};

export default class PostPreview extends React.Component<Props, State> {

  constructor( props: Props ) {
    super( props );

    this.state = {
      activeZone: ''
    }
  }

  render() {
    if ( this.props.loading )
      return <CircularProgress className="mt-loading" />

    const post = this.props.post;
    const doc = post.document as IDocument<'client'>;
    const draft = doc.currentDraft as IDraft<'client'>;
    const zones = ( doc.template as ITemplate<'client'> ).zones;
    const activeZone = this.state.activeZone || ( doc.template as ITemplate<'client'> ).defaultZone;

    return <Container id="mt-post-preview">
      <div className="mt-preview-headers">
        <div className="mt-preview-author-avatar">
          <Avatar src={generateAvatarPic( post.author as IUserEntry<'client'> )} />
        </div>
        <div>
          <h1 id="mt-preview-title">{post.title}</h1>
          <div id="mt-header-details">
            <span>Posted </span>
            {post.author ? <span>by <span id="mt-preview-author">{( post.author as IUserEntry<'client'> ).username}</span></span> : undefined}
            <span id="mt-preview-date">{format( new Date( post.lastUpdated ), '[at] H:m [on] MMMM Do YYYY' )}</span>
          </div>
          <div>
            {zones.map( z => <Tab active={activeZone === z}>{z}</Tab> )}
          </div>
          <div
            id="mt-preview-content"
            dangerouslySetInnerHTML={{ __html: draft.html[ activeZone ] }}
          />
        </div>
      </div>
      <div id="mt-preview-comments">
        {this.props.renderComments ? this.props.renderComments() : undefined}
      </div>
    </Container >
  }
}
interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
}

const Tab = styled.form`
  border: 1px solid ${theme.light100.border };
  background: ${( props: TabProps ) => props.active ? theme.light100.background : theme.light200.background };
`

const Container = styled.form`


  h1 {
    margin: 0 0 10px 0;
  }

  #mt-preview-author {
    font-weight: 400;
  }

  #mt-preview-comments {
    padding: 0 20px 20px 20px;
  }

  #mt-preview-date {
    color: ${theme.light200.softColor };
    font-size: 12px;
    font-style: italic;
  }

  #mt-header-details {
    margin: 0 0 20px 0;
  }

  .mt-preview-headers {
    display: flex;
    background: ${theme.light100.background };
    border: 1px solid ${theme.light100.border };
    margin: 10px 10px 0 10px;
    padding: 10px;
    margin: 10px 10px 0 10px;
    border-radius: 10px;

    > div {
      flex: 1;
      &:first-child {
        max-width: 50px;
      }
    }
  }

  #mt-header-details > span {
    margin: 0 5px 0 0;
  }
`;