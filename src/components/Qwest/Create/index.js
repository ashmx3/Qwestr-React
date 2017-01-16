import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Panel
} from 'react-bootstrap';
import { createQwest } from '../../../lib/qwest';
import './style.css';

class QwestCreate extends Component {
  constructor(props) {
    // set props
    super(props);

    // set state
    this.state = {
      title: ''
    };

    // bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange(event) {
    // update state values
    this.setState({title: event.target.value});
  }

  handleFormSubmit(event) {
    // stop the form submission from reloading the page
    event.preventDefault();

    // Create Qwest object.
    const qwestData = {
      title: this.state.title
    };

    // create the Qwest
    createQwest(qwestData);
  }

  render() {
    // declare relevant properties as local variables
    const { className, ..._props } = this.props;

    // declare other local variables
    const panelHeader = (<h3>Create New Qwest</h3>);

    // render the veiw
    return (
      <div className={classnames('Qwest', className)}>
        <div className="Qwest-content">
          <Panel header={panelHeader}>
            <Form horizontal onSubmit={this.handleFormSubmit}>
              <FormGroup controlId="title">
                <Col componentClass={ControlLabel} sm={2}>Title</Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    placeholder="What This Qwest will be Called"
                    onChange={this.handleChange}
                    value={this.state.title}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit">Create</Button>
                </Col>
              </FormGroup>
            </Form>
          </Panel>
        </div>
      </div>
    );
  }
}

export default QwestCreate;