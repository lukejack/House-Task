var React = require('react');
var Dropzone = require('react-dropzone');
import Crop from 'react-image-crop';

//Component using http://okonet.ru/react-dropzone/
class Drop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prev: false,
            cropTemp: {
                        aspect: 1
                    },
            cropSpec: null
        };
        this.onDrop = this.onDrop.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.cropFinish = this.cropFinish.bind(this);
    }
    onDrop(files) {
        this.setState({ prev: files[0].preview });
        this.props.setImage(files[0]);
    }

    onCropChange(crop, pixelCrop) {
        this.setState({ cropSpec: pixelCrop, croptemp: pixelCrop });

    }

    cropFinish() {
        //https://yellowpencil.com/blog/cropping-images-with-javascript/
        var loadTimer;
        var imgObject = new Image();

        imgObject.src = this.state.prev;
        var newImg = getImagePortion(imgObject, this.state.cropSpec.width, this.state.cropSpec.height, this.state.cropSpec.x, this.state.cropSpec.y, 1);
        this.setState({ prev: false, crop: newImg});
        function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
            /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
            //set up canvas for thumbnail
            var tnCanvas = document.createElement('canvas');
            var tnCanvasContext = tnCanvas.getContext('2d');
            tnCanvas.width = newWidth; tnCanvas.height = newHeight;

            /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
            var bufferCanvas = document.createElement('canvas');
            var bufferContext = bufferCanvas.getContext('2d');
            bufferCanvas.width = imgObj.width;
            bufferCanvas.height = imgObj.height;
            bufferContext.drawImage(imgObj, 0, 0);

            /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
            tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio, 0, 0, newWidth, newHeight);
            return tnCanvas.toDataURL();
        }
        //console.log('Bottom setting image: ', this.state.crop);
        this.props.setImage(newImg);
    }

    render() {
        let imagePreview;
        if (this.state.prev) {
            //imagePreview = <img src={this.state.prev} style={{maxWidth: "100px", maxHeight: "100px", objectFit: "contain"}}/>
            imagePreview =
                <div>
                    <p>Please drag to crop your image into a square</p>
                    <button onClick={this.cropFinish}>Crop</button>
                    <Crop src={this.state.prev} onComplete={this.onCropChange} minWidth={20} minHeight={20} crop={this.state.cropTemp} style={{width: '200px'}}/>
                    
                </div>;

        } else {
            if (this.state.crop) {
                console.log('crop: ', this.state.crop);
                imagePreview = <img src={this.state.crop} style={{maxWidth: '70vw'}}></img>;
            } else
                imagePreview = <p></p>;
        }
        return (
            <div>
                <Dropzone onDrop={this.onDrop} multiple={false} style={{ height: "50px", width: "100%" }}>
                    <div>Click to select an image, or drop one here</div>
                </Dropzone>
                {imagePreview}
            </div>
        );
    }
};

export default Drop;