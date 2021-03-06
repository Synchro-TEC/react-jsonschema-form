import React, { Component } from "react";
import { render } from "react-dom";
import Codemirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";

import { shouldRender } from "../src/utils";
import { samples } from "./samples";
import Form from "../src";

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/eclipse.css";

// Patching CodeMirror#componentWillReceiveProps so it's executed synchronously
// Ref https://github.com/mozilla-services/react-jsonschema-form/issues/174
Codemirror.prototype.componentWillReceiveProps = function(nextProps) {
  if (
    this.codeMirror &&
    nextProps.value !== undefined &&
    this.codeMirror.getValue() != nextProps.value
  ) {
    this.codeMirror.setValue(nextProps.value);
  }
  if (typeof nextProps.options === "object") {
    for (var optionName in nextProps.options) {
      if (nextProps.options.hasOwnProperty(optionName)) {
        this.codeMirror.setOption(optionName, nextProps.options[optionName]);
      }
    }
  }
};

const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const liveValidateSchema = { type: "boolean", title: "Live validation" };
const cmOptions = {
  theme: "default",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2,
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2,
};
// const themes = {
//   default: {
//     stylesheet:
//       "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
//   },
//   cerulean: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cerulean/bootstrap.min.css",
//   },
//   cosmo: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cosmo/bootstrap.min.css",
//   },
//   cyborg: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cyborg/bootstrap.min.css",
//     editor: "blackboard",
//   },
//   darkly: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/darkly/bootstrap.min.css",
//     editor: "mbo",
//   },
//   flatly: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/flatly/bootstrap.min.css",
//     editor: "ttcn",
//   },
//   journal: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/journal/bootstrap.min.css",
//   },
//   lumen: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/lumen/bootstrap.min.css",
//   },
//   paper: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/paper/bootstrap.min.css",
//   },
//   readable: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/readable/bootstrap.min.css",
//   },
//   sandstone: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/sandstone/bootstrap.min.css",
//     editor: "solarized",
//   },
//   simplex: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/simplex/bootstrap.min.css",
//     editor: "ttcn",
//   },
//   slate: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/slate/bootstrap.min.css",
//     editor: "monokai",
//   },
//   spacelab: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/spacelab/bootstrap.min.css",
//   },
//   "solarized-dark": {
//     stylesheet:
//       "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-dark.css",
//     editor: "dracula",
//   },
//   "solarized-light": {
//     stylesheet:
//       "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-light.css",
//     editor: "solarized",
//   },
//   superhero: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/superhero/bootstrap.min.css",
//     editor: "dracula",
//   },
//   united: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/united/bootstrap.min.css",
//   },
//   yeti: {
//     stylesheet:
//       "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/yeti/bootstrap.min.css",
//     editor: "eclipse",
//   },
// };

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="sv-row">
          <div className="sv-column">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange("lat")}
            />
          </div>
          <div className="sv-column">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange("lon")}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = code => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    const icon = this.state.valid ? "check" : "times";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="sv-segment">
        <div
          style={{ background: "#f7f7f7", borderBottom: "1px solid #ddd" }}
          className="sv-pa--5">
          <i className={`${cls} fa fa-${icon}`} />
          {" " + title}
        </div>
        <Codemirror
          value={this.state.code}
          onChange={this.onCodeChange}
          options={Object.assign({}, cmOptions, { theme })}
        />
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <ul className="sv-list-inline">
        {Object.keys(samples).map((label, i) => {
          return (
            <li
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}>
              <a href="#" onClick={this.onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

// function ThemeSelector({ theme, select }) {
//   const themeSchema = {
//     type: "string",
//     enum: Object.keys(themes),
//   };
//   return (
//     <Form
//       schema={themeSchema}
//       formData={theme}
//       onChange={({ formData }) => select(formData, themes[formData])}>
//       <div />
//     </Form>
//   );
// }

// class CopyLink extends Component {
//   onCopyClick = event => {
//     this.input.select();
//     document.execCommand("copy");
//   };
//
//   render() {
//     const { shareURL, onShare } = this.props;
//     if (!shareURL) {
//       return (
//         <button className="sv-button default" type="button" onClick={onShare}>
//           Share
//         </button>
//       );
//     }
//     return (
//       <div className="input-group">
//         <input
//           type="text"
//           ref={input => (this.input = input)}
//           className="form-control"
//           defaultValue={shareURL}
//         />
//         <span className="input-group-btn">
//           <button
//             className="sv-button default"
//             type="button"
//             onClick={this.onCopyClick}>
//             <i className="glyphicon glyphicon-copy" />
//           </button>
//         </span>
//       </div>
//     );
//   }
// }

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      editor: "default",
      theme: "default",
      liveValidate: true,
      shareURL: null,
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(samples.Simple);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate } = data;
    // force resetting form component instance
    this.setState({ form: false }, _ =>
      this.setState({ ...data, form: true, ArrayFieldTemplate })
    );
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  // onThemeSelected = (theme, { stylesheet, editor }) => {
  //   this.setState({ theme, editor: editor ? editor : "default" });
  //   setImmediate(() => {
  //     // Side effect!
  //     document.getElementById("theme").setAttribute("href", stylesheet);
  //   });
  // };

  setLiveValidate = ({ formData }) => this.setState({ liveValidate: formData });

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  // onShare = () => {
  //   const { formData, schema, uiSchema } = this.state;
  //   const { location: { origin, pathname } } = document;
  //   try {
  //     const hash = btoa(JSON.stringify({ formData, schema, uiSchema }));
  //     this.setState({ shareURL: `${origin}${pathname}#${hash}` });
  //   } catch (err) {
  //     this.setState({ shareURL: null });
  //   }
  // };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveValidate,
      validate,
      editor,
      ArrayFieldTemplate,
      transformErrors,
    } = this.state;

    return (
      <div className="sv-pa--20">
        <h1>Saturn-V React JsonSchema Form</h1>
        <div className="sv-row">
          <div className="sv-column _80">
            <Selector onSelected={this.load} />
          </div>
          <div className="sv-column _20 sv-text-center">
            <Form
              schema={liveValidateSchema}
              formData={liveValidate}
              onChange={this.setLiveValidate}>
              <div />
            </Form>
          </div>
        </div>

        <div className="sv-row">
          <div className="sv-column _60 sv-pr--20">
            <div className="sv-row">
              <div className="sv-column">
                <Editor
                  title="JSONSchema"
                  theme={editor}
                  code={toJson(schema)}
                  onChange={this.onSchemaEdited}
                />
              </div>
            </div>
            <div className="sv-row--with-gutter">
              <div className="sv-column">
                <Editor
                  title="UISchema"
                  theme={editor}
                  code={toJson(uiSchema)}
                  onChange={this.onUISchemaEdited}
                />
              </div>
              <div className="sv-column">
                <Editor
                  title="formData"
                  theme={editor}
                  code={toJson(formData)}
                  onChange={this.onFormDataEdited}
                />
              </div>
            </div>
          </div>
          <div className="sv-column _60">
            {this.state.form && (
              <Form
                ArrayFieldTemplate={ArrayFieldTemplate}
                liveValidate={liveValidate}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onFormDataChange}
                onSubmit={({ formData }) =>
                  console.log("submitted formData", formData)}
                fields={{ geo: GeoPosition }}
                validate={validate}
                onBlur={(id, value) =>
                  console.log(`Touched ${id} with value ${value}`)}
                onFocus={(id, value) =>
                  console.log(`Focused ${id} with value ${value}`)}
                transformErrors={transformErrors}
                onError={log("errors")}>
                <div className="sv-form-action">
                  <button className="sv-button out-info" type="button">
                    cancelar
                  </button>
                  <button className="sv-button info sv-ml--15" type="submit">
                    salvar
                  </button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
