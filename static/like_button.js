'use strict';  //Enters strict mode, new to ECMA 5. https://www.w3schools.com/js/js_strict.asp

const e = React.createElement; //The react object has already been imported back in the main HTML page. 

class LikeButton extends React.Component {  //Create a child class. React uses classes to describe everything. 
  constructor(props) { //props stands for properties. 
    super(props); //super lets you use the "this" keyword. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor
    this.state = { liked: false };
  }

  render() { //basically contains the for loop to decide which state to run. 
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e( //Recursion
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
} //end component
const domContainer = document.querySelector('#like_button_container'); //Select the DIV from the HTML that will hold this react element
ReactDOM.render(e(LikeButton), domContainer); //fires the whole thing up. Rememember the React library handles object management.

//Notes
//An element is the smallest building block of a react app. 

//