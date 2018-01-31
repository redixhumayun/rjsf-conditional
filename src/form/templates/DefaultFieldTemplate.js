import React, { Component } from 'react';
import * as evaluate from 'static-eval';
import { parse } from 'esprima';

let hiddenElements = [];

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, label, description, errors, children, conditionalSchema } = this.props;
        // console.log("DFT", this.props.children.props.formData, id);
        let ownHidden = 'block';
        console.log(hiddenElements);
        console.log(id);
        if(hiddenElements.length > 0) {
            hiddenElements.map(h => {
                let temp_id = id.replace('root_', '');
                if(h === temp_id) {
                    ownHidden = 'none';
                }
            })
        }
        if(id === 'root') {
            hiddenElements = [];            
            for(const [field, conObj] of Object.entries(conditionalSchema)) {
                let expression = parse(conObj.expression).body[0].expression;
                let lookup = 'this.props.children.props.formData.' + field;
                let payload = {};
                payload[field] = eval(lookup);
                if(!evaluate(expression, payload)) {
                    conObj.dependents.map(c => hiddenElements.push(c));
                }
            }
            if(hiddenElements.length === 0) {
                setTimeout(() => {
                    this.props.callFun("Re-render");
                }, 1);
            }
        }
        // for(const [field, valObj] of Object.entries(conditionalSchema)) {
        //     valObj.dependents.filter(d => d === id)
        //                      .map(e => valObj.result ? ownHidden = 'block' : ownHidden = 'none');
        // }

        return (
            <div style={{ display: ownHidden }}>
                <label htmlFor={id}>{label}</label>
                {description}
                {children}
                {errors}
            </div>
        );
    }
}

export default DefaultFieldTemplate;