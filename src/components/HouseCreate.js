import React from 'react';

class HouseCreate extends React.Component {
   render() {
      return (
        <div>
            <form action="/post/housecreate" method="post">
                <label>
                    House name:
                </label>
                <input type="text" name="name"/>
                <button type="submit">Submit</button>
            </form>
        </div>
      );
   }
}

export default HouseCreate;