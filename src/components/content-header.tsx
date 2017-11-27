import * as React from 'react';
import { default as styled } from '../theme/styled';

type Props = {
  title: string;
  style?: React.CSSProperties;
  renderSubHeader?: () => JSX.Element;
}

export class ContentHeader extends React.Component<Props, any> {

  constructor( props: Props ) {
    super( props );
  }

  render() {
    return (
      <Container style={this.props.style} className="mt-content-header">
        <Header>
          <h2>{this.props.title}</h2>
        </Header>
        <SubHeader>
          {this.props.renderSubHeader ? this.props.renderSubHeader() : undefined}
        </SubHeader>
      </Container>
    )
  }
}

const Container = styled.div`
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.3);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #fff;
  height: 100px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  overflow: hidden;
  padding: 0 20px;
`;

const SubHeader = styled.div`
  height: 50px;
`;