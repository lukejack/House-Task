var React = require('react');
var Dropzone = require('react-dropzone');

//Component using http://okonet.ru/react-dropzone/
class Drop extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            prev: false
        };
        this.onDrop = this.onDrop.bind(this);
    }
    onDrop(files) {
      this.setState({prev: files[0].preview});
      this.props.setImage(files[0]);
    }

    render(){
      let imagePreview;
      if (this.state.prev){
          imagePreview = <img src={this.state.prev} style={{maxWidth: "100px", maxHeight: "100px", objectFit: "contain"}}/>
      } else {
          imagePreview = <p></p>
      }
      return (
          <div>
            <Dropzone onDrop={this.onDrop} multiple={false} style={{height: "50px", width: "100%"}}>
              <div>Click to select an image, or drop one here</div>
              
            </Dropzone>
            {imagePreview}
          </div>
      );
    }
};

export default Drop;