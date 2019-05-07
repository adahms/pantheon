import React, { Component } from 'react';
import { TextInput, Label, BackgroundImage, BackgroundImageSrc } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import '@app/app.css';

export default class Index extends Component {
  public state = {
    redirect: false,
    redirectLocation: '',
    input: '',
    columns: ['Name', 'Description', 'Source Type', 'Source Name', 'Upload Time'],
    data: [{"jcr:created": '', "name": "search_intro_message_thn","jcr:title": "Search is case sensitive. Enter '*' for all modules.", "jcr:description": "", "sling:resourceType": "", "pant:transientSource":""}]
  };
  public render() {
    const { columns, input } = this.state;
    return (
      <React.Fragment>
        <div className="app-container">
          <div>
          <div className="row-view">
            <Label>Search:</Label>
            <TextInput value={input} id="search" onChange={() => this.getRows(event)} type="text" placeholder="*" />
            </div>
            <Table aria-label="table-header" rows={[]} cells={columns} >
              <TableHeader />
            </Table>
            {this.renderPreview()}
            {this.state.data.map(data => (
              <Table id="table-rows" aria-label="table-data" key={data.name} rows={[[data["jcr:title"], data["jcr:description"], data["sling:resourceType"], data["pant:transientSource"], data["jcr:created"].toString()]]} cells={columns} >
                <TableBody onRowClick={() => this.setPreview(data.name)} />
              </Table>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private getRows = (event) => {
    console.log("what do I see? " + event.target.value)
    this.setState({
      input: event.target.value
    }, () => {
      console.log("Now I get the expected value down " + this.state.input)
      var backend = "/modules.json?search="
      if (this.state.input != null && this.state.input != "" && this.state.input != "*") {
        backend = backend + this.state.input
        console.log(backend)
      }
      fetch(backend)
        .then(response => response.json())
        .then(responseJSON => this.setState({ data: responseJSON }))
        .then(() => console.log("JSON string is " + JSON.stringify(this.state.data)))
    })
  };


  private setPreview(name: string) {
    console.log("what do I when you click ? " + name)
    if (name != "search_intro_message_thn") {
      this.setState({
        redirect: true,
        redirectLocation: name
      })
    }
  };

  renderPreview = () => {
    if (this.state.redirect) {
      console.log(this.state.redirect)
      return window.location.assign("/modules/" + this.state.redirectLocation + ".preview");
    } else {
      console.log(this.state.redirect)
      return ""
    }
  };

}