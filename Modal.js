import React from 'react'
import PropTypes from 'prop-types';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'

export default class Modal extends React.Component {  
	static propTypes = {
		isModalOpen: PropTypes.bool.isRequired,
		closeModal: PropTypes.func.isRequired
    };

	render() {
    
		return (

          <div id ="VModal" className='modal container bg-white rounded  scrollable shadow-lg '
        style={{display: this.props.isModalOpen ? 'block' : 'none' }}tabIndex="-1" role="dialog">
      
            <div className='row rounded border bg-primary text-white modal-dialog-scrollable ' >
            
              <div className='col-11 VModal'></div>
              
              <div className='col-1 VModal' >
                <button type="button" className="close" aria-label="Close" id="close"
                onClick={this.props.closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
   
			<div className= "VModal">{this.props.children}</div>
         
            </div>
		  
		);
	}
}
	



