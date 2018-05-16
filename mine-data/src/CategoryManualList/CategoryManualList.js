import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  addCategory, fetchCategories, removeCategory,
  resetCategoryList, hideConfirmation, resetSubmit,
  setMode,
  setNoneMode, showConfirmation, submitTicket
} from './categoryManualList.actions';
import classNames from 'classnames';
import SubmitButton from '../SubmitButton/SubmitButton';
import { withManualDetails } from '../CategoryCard/withManualDetails';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { compose } from 'redux';
import { withTitle } from '../CategoryCard/withTitle';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { Alert, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Loading } from '../Loading/Loading';
import Checkbox from '../Checkbox/Checkbox';
import { Info } from '../Info/Info';

import './CategoryManualList.scss';

const ManualCard = compose(withManualDetails, withTitle)(CategoryCard);
const CollapsibleList = compose(withCollapse)(CategoryList);

const ModeButton = ({active, className, ...rest}) => (
  <SubmitButton {...rest} className={classNames(className, 'ModeButton', {active})}/>
);

class List extends React.Component {
  static fetchCategoriesIfNeeded({categories: {pending, categories}, fetchCategories}) {
    if (!pending && !categories) {
      fetchCategories();
    }
  }

  static getCategoryId({category}) {
    return category.name;
  }

  constructor(props) {
    super(props);

    this.isSelected = this.isSelected.bind(this);
    this.showConfirmationIfNeeded = this.showConfirmationIfNeeded.bind(this);
    this.submitTicket = this.submitTicket.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
  }

  componentWillMount() {
    List.fetchCategoriesIfNeeded(this.props);
  }

  componentWillReceiveProps(props) {
    List.fetchCategoriesIfNeeded(props);
  }

  componentWillUnmount() {
    this.props.resetCategoryList();
    this.props.setNoneMode();
    this.props.resetTicket();
  }

  isSelected(category) {
    return this.props.list.includes(category.name);
  }

  showConfirmationIfNeeded() {
    if (this.props.mode === 'delete') {
      this.props.showConfirmation();
    } else {
      this.submitTicket();
    }
  }

  submitTicket() {
    this.props.submitTicket({
      categories: this.props.list,
      user: this.props.userInfo.userInfo.profile,
      mode: this.props.mode
    }).then(() => {
      this.props.hideConfirmation();
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
      this.props.resetCategoryList();
      this.props.setMode(newMode);
    }
  }

  render() {
    const {list, mode, submit, categories, confirm} = this.props;
    const isModeInsight = mode === 'insight';
    const isTicketModeInsight = submit.mode === 'insight';
    const isModeDelete = mode === 'delete';

    if (categories.pending) {
      return <Loading />;
    }

    if (categories.categories) {
      return (
        <Fragment>
          <div className="nav-buttons justify-content-start">
            <ModeButton onClick={() => this.toggleMode('insight')} active={isModeInsight}>Indsigt</ModeButton>
            <ModeButton onClick={() => this.toggleMode('delete')} color="danger" active={isModeDelete}>Sletning</ModeButton>
          </div>
          <CollapsibleList getId={List.getCategoryId}>
            {categories.categories
              .filter(category => category.manual)
              .map(category =>
                <ManualCard key={category.name} category={category}
                            sideNav={() => {
                  if (!!mode) {
                    if (mode === 'insight' || category.deleteAllowed) {
                      return <Checkbox checked={this.isSelected(category)}
                                       onChange={() => this.toggle(category)}/>;
                    }

                    return <Info id={category.name}>You cannot delete data for this category</Info>;
                  }

                  return null;
                }}/>)}
          </CollapsibleList>
          {mode ? (
            <Fragment>
              <div className="nav-buttons justify-content-start">
                <SubmitButton disabled={!list.length} loading={confirm || submit.pending} onClick={this.showConfirmationIfNeeded}>Send anmodning</SubmitButton>
              </div>
            </Fragment>
          ) : null}
          <Modal centered isOpen={confirm} toggle={this.props.hideConfirmation}>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalBody>Are you sure?</ModalBody>
            <ModalFooter>
              <SubmitButton loading={submit.pending} onClick={this.submitTicket}>Confirm</SubmitButton>
              <SubmitButton color="link" onClick={this.props.hideConfirmation}>Cancel</SubmitButton>
            </ModalFooter>
          </Modal>
          <Modal centered isOpen={submit.fetched && !submit.failed} toggle={this.props.resetTicket}>
            <ModalBody>
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
            </ModalBody>
          </Modal>
          <Alert className="message" color="danger" isOpen={submit.fetched && submit.failed} toggle={this.props.resetTicket}>
            Your request has not been sent
          </Alert>
        </Fragment>
      );
    }

    return null;
  }
}

const mapStateToProps = ({userInfo, categoryManualList: {list, mode, submit, categories, confirm}}) => ({
  list,
  mode,
  submit,
  userInfo,
  categories,
  confirm
});

const mapDispatchToProps = (dispatch) => ({
  onAddCategory: (category) => dispatch(addCategory(category.name)),
  onRemoveCategory: (category) => dispatch(removeCategory(category.name)),
  fetchCategories: () => dispatch(fetchCategories()),
  resetCategoryList: () => dispatch(resetCategoryList()),
  setNoneMode: () => dispatch(setNoneMode()),
  setMode: (newMode) => dispatch(setMode(newMode)),
  showConfirmation: () => dispatch(showConfirmation()),
  submitTicket: (payload) => dispatch(submitTicket(payload)),
  resetTicket: () => dispatch(resetSubmit()),
  hideConfirmation: () => dispatch(hideConfirmation())
});

export const CategoryManualList = connect(mapStateToProps, mapDispatchToProps)(List);