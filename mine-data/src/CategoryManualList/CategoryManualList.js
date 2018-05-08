import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import data from '../../data';
import {
  addCategory, removeCategory, resetCategories, resetSubmit, setMode,
  setNoneMode, submitTicket
} from './categoryManualList.actions';
import classNames from 'classnames';
import SubmitButton from '../SubmitButton/SubmitButton';
import { withManualDetails } from '../CategoryCard/withManualDetails';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { compose } from 'redux';
import { withTitle } from '../CategoryCard/withTitle';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { withCheckbox } from '../CategoryCard/withCheckbox';
import { withCheckboxList } from '../CategoryList/withCheckboxList';
import { Alert } from 'reactstrap';

import './CategoryManualList.scss';

const ManualCard = compose(withCheckbox, withManualDetails, withTitle)(CategoryCard);
const CollapsibleList = compose(withCheckboxList, withCollapse)(CategoryList);

const ModeButton = ({active, className, ...rest}) => (
  <SubmitButton {...rest} className={classNames(className, 'ModeButton', {active})}/>
);

class List extends React.Component {
  constructor(props) {
    super(props);

    this.isSelected = this.isSelected.bind(this);
    this.submitTicket = this.submitTicket.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
  }

  componentWillUnmount() {
    this.props.resetCategories();
    this.props.setNoneMode();
  }

  isSelected(category) {
    return this.props.list.includes(category.name);
  }

  submitTicket() {
    this.props.submitTicket({
      categories: this.props.list,
      user: this.props.userInfo.userInfo.profile,
      mode: this.props.mode
    });
  }

  toggle(category) {
    if (this.isSelected(category)) {
      this.props.onRemoveCategory(category);
    } else {
      this.props.onAddCategory(category);
    }
  }

  toggleMode(newMode) {
    if (this.props.mode === newMode) {
      this.props.setNoneMode();
    } else {
      this.props.resetCategories();
      this.props.setMode(newMode);
    }
  }

  render() {
    const {list, mode, submit} = this.props;
    const isModeInsight = mode === 'insight';
    const isTicketModeInsight = submit.mode === 'insight';
    const isModeDelete = mode === 'delete';

    return (
      <Fragment>
        <div className="nav-buttons justify-content-start">
          <ModeButton onClick={() => this.toggleMode('insight')} active={isModeInsight}>Request insights</ModeButton>
          <ModeButton onClick={() => this.toggleMode('delete')} color="danger" active={isModeDelete}>Request delete</ModeButton>
        </div>
        <CollapsibleList isChecked={this.isSelected} onCheck={this.toggle}
                         getId={({category}) => category.name}>
          {data.categories.map(category => <ManualCard key={category.name} category={category} enabled={mode} />)}
        </CollapsibleList>
        {mode ? (
          <Fragment>
            <p>Hvis du er er uenig i vores behandling af din indsigts- eller sletteanmodning, har du mulighed for at klage til Datatilsynet. Læs nærmere <a href="https://www.datatilsynet.dk/borger/klage-til-datatilsynet" target="_blank">her</a>.</p>
            <div className="nav-buttons justify-content-start">
              <SubmitButton disabled={!list.length} onClick={this.submitTicket}>Submit</SubmitButton>
            </div>
          </Fragment>
        ) : null}
        <Alert className="message" color="success" isOpen={submit.fetched && !submit.failed} toggle={this.props.resetTicket}>
          <p>Tak for din henvendelse.</p>
          {isTicketModeInsight ?
            <p>Din indsigtsanmodning vil blive besvaret og sendt til dig på mail inden for 30 dage.</p> :
            <p>
              Du vil inden for 30 dage modtage bekræftelse på, at dine data er blevet slettet.<br/>
              Bemærk, at hvis du har data i kategorierne x, y, og z vil disse ikke blive slettet. Dette skyldes at Berlingske Media f.eks. har en retslig forpligtelse til at gemme disse oplysninger.
            </p>}
          <p>Hvis du er er uenig i vores behandling af din {isTicketModeInsight ? 'indsigtsanmodning' : 'sletteanmodning'}, har du mulighed for at klage til Datatilsynet. Læs nærmere <a href="https://www.datatilsynet.dk/borger/klage-til-datatilsynet" target="_blank">her</a>.</p>
          <div className="nav-buttons justify-content-start">
            <SubmitButton onClick={this.props.resetTicket}>Close</SubmitButton>
          </div>
        </Alert>
        <Alert className="message" color="danger" isOpen={submit.fetched && submit.failed} toggle={this.props.resetTicket}>
          Your request has not been sent
        </Alert>
      </Fragment>
    );
  }
}

const mapStateToProps = ({userInfo, categoryManualList: {list, mode, submit}}) => ({
  list,
  mode,
  submit,
  userInfo
});

const mapDispatchToProps = (dispatch) => ({
  onAddCategory: (category) => dispatch(addCategory(category.name)),
  onRemoveCategory: (category) => dispatch(removeCategory(category.name)),
  resetCategories: () => dispatch(resetCategories()),
  setNoneMode: () => dispatch(setNoneMode()),
  setMode: (newMode) => dispatch(setMode(newMode)),
  submitTicket: (payload) => dispatch(submitTicket(payload)),
  resetTicket: () => dispatch(resetSubmit())
});

export const CategoryManualList = connect(mapStateToProps, mapDispatchToProps)(List);