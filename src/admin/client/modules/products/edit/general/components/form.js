
import React from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Editor from 'modules/shared/editor'

import messages from 'lib/text'
import style from './style.css'
import api from 'lib/api'

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

const slugExists = (values) => {
  if(values.slug && values.slug.length > 0) {
    return api.products.slugExists(values.id, values.slug).then(response => response.status === 200);
  } else {
    return Promise.resolve(false);
  }
}

const asyncValidate = (values) => {
  return Promise.all([
      slugExists(values),
    ]).then(([ isSlugExists ]) => {
      let errors = {};

      if(isSlugExists) {
        errors.slug = messages.errors_urlTaken;
      }

      if (Object.keys(errors).length > 0) {
        return Promise.reject(errors)
      } else {
        return Promise.resolve();
      }
    });
}

class ProductGeneralForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData(this.props.productId);
  }

  componentWillUnmount() {
    this.props.eraseData();
  }

  render() {
    let {
      handleSubmit,
      pristine,
      submitting,
      initialValues,
      settings } = this.props;

      return (
        <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
              <Paper className={style.form} zDepth={1}>
                  <div className={style.innerBox}>
                    <Field name="name" component={TextField} floatingLabelText={messages.products_name+' *'} fullWidth={true}/>
                    <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true}/>
                    <p className="field-hint">{messages.help_slug}</p>
                    <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/>
                    <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
                    <div className="blue-title" style={{ marginTop: 50 }}>{messages.description}</div>
                    <Field
                      name="description"
                      component={Editor}
                    />
                  </div>
                  <div className="buttons-box">
                    <Link to={'/admin/products'}>
                      <FlatButton label={messages.actions_cancel} className={style.button} />
                    </Link>
                    <RaisedButton type="submit" label={messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting}/>
                  </div>
              </Paper>
        </form>
      )
  }
}

export default reduxForm({
  form: 'ProductGeneralForm',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'slug' ],
  enableReinitialize: true
})(ProductGeneralForm)
