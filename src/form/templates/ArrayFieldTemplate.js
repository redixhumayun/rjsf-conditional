import React, { Component } from 'react';
import { parse } from 'esprima';
import * as evaluate from 'static-eval';

class ArrayFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { conditionalSchema, idSchema } = this.props;
        let ownHidden = 'block';
        for(const [field, condObj] of Object.entries(conditionalSchema)) {
            if(field === idSchema["$id"].replace("root_", "")) {
                let expression = parse(condObj.expression).body[0].expression;
                console.log(expression);
                console.log(this.props.formData[field]);
                // let result = evaluate([true, "random", false], expression);
            }
        }
        return (
            <div>
                {this.props.items.map(el => {
                    return (
                        <div>
                            {el.children}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ArrayFieldTemplate;