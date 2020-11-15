// https://github.com/jpuri/react-draft-wysiwyg/issues/979
 import React from "react";

export default  function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();

    // Convert image type to mediaComponent
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar',
        },
      };
    }
  }

class MediaComponent extends React.Component {
    render() {
      const { block, contentState } = this.props;
      const { foo } = this.props.blockProps;
      const data = contentState.getEntity(block.getEntityAt(0)).getData();
      

      const emptyHtml = ' ';
      return (
        <div>
          {emptyHtml}
          <img src={data.src} alt={data.alt || ''} style={{height: data.height || 'auto', width: data.width || 'auto'}}/>
        </div>
      );
    }
  }