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
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
    this.showConfirmation = this.showConfirmation.bind(this);
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

  showConfirmation() {
    this.props.showConfirmation(this.props.mode);
  }

  submitTicket() {
    this.props.submitTicket({
      categories: this.props.list,
      uid: this.props.userInfo.userInfo.UID,
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
    const {list, mode, submit, categories, confirmMode} = this.props;
    const isModeInsight = mode === 'insight';
    const isConfirmModeInsight = confirmMode.mode === 'insight';
    const isModeDelete = mode === 'delete';
    const showConfirm = confirmMode.visible;

    if (categories.pending) {
      return <Loading />;
    }

    if (categories.categories) {
      return (
        <div className="CategoryManualList">
          <div className="nav-buttons justify-content-start">
            <ModeButton onClick={() => this.toggleMode('insight')} active={isModeInsight}>Se data</ModeButton>
            <ModeButton onClick={() => this.toggleMode('delete')} active={isModeDelete}>Slet data</ModeButton>
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

                    return <Info id={category.name}>Vi kan ikke imødekomme sletning i denne kategori, da vi er retsligt forpligtet til at gemme disse data.</Info>;
                  }

                  return null;
                }}/>)}
          </CollapsibleList>
          {mode ? (
            <Fragment>
              <div className="nav-buttons justify-content-end">
                <SubmitButton disabled={!list.length} loading={showConfirm || submit.pending} onClick={this.showConfirmation}>Send anmodning</SubmitButton>
              </div>
            </Fragment>
          ) : null}
          <Modal centered isOpen={showConfirm} toggle={this.props.hideConfirmation}>
            {isConfirmModeInsight ? null : <ModalHeader>ADVARSEL!</ModalHeader>}
            <ModalBody>
              {
                isConfirmModeInsight ?
                  <p>Bekræft venligst at du ønsker dine data tilsendt på mail inden for 30 dage.</p>
                :
                  <p>
                    Du er ved at slette alle dine personoplysninger i de angivne kategorier.
                    <br/>Dette kan medføre en forringet brugeoplevelse ved brug af vores tjenester.
                    <br/>
                    <br/>Er du sikker på du vil slette dine data?
                  </p>
              }
            </ModalBody>
            <ModalFooter>
              <SubmitButton loading={submit.pending} onClick={this.submitTicket}>Bekræft</SubmitButton>
              <SubmitButton color="link" onClick={this.props.hideConfirmation}>Afbryd</SubmitButton>
            </ModalFooter>
          </Modal>
          <Modal centered isOpen={submit.fetched} toggle={this.props.resetTicket}>
            <ModalBody>
              {
                !submit.failed ? (
                  <Fragment>
                    <p>Tak for din henvendelse.</p>
                    {
                      isConfirmModeInsight ?
                        <p>Din indsigtsanmodning vil blive besvaret og sendt til dig på mail inden for 30 dage.</p>
                      :
                        <p>
                          Du vil inden for 30 dage modtage bekræftelse på, at dine data er blevet slettet.<br/>
                          Bemærk, at hvis du har data i kategorierne x, y, og z vil disse ikke blive slettet. Dette skyldes at Berlingske Media f.eks. har en retslig forpligtelse til at gemme disse oplysninger.
                        </p>
                    }
                    <p>Hvis du er er uenig i vores behandling af din {isConfirmModeInsight ? 'indsigtsanmodning' : 'sletteanmodning'}, har du mulighed for at klage til Datatilsynet. Læs nærmere <a href="https://www.datatilsynet.dk/borger/klage-til-datatilsynet" target="_blank">her</a>.</p>
                  </Fragment>
                ) :
                  <p>
                    Din anmodning er ikke sendt grundet en teknisk fejl. Kontakt venligst <a href="mailto:persondata@berlingskemedia.dk">persondata@berlingskemedia.dk</a> for at få hjælp til din anmodning.
                  </p>
              }
            </ModalBody>
            <ModalFooter>
              <SubmitButton onClick={this.props.resetTicket}>OK</SubmitButton>
            </ModalFooter>
          </Modal>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = ({userInfo, categoryManualList: {list, mode, submit, categories, confirmMode}}) => ({
  list,
  mode,
  submit,
  userInfo,
  categories,
  confirmMode
});

const mapDispatchToProps = (dispatch) => ({
  onAddCategory: (category) => dispatch(addCategory(category.name)),
  onRemoveCategory: (category) => dispatch(removeCategory(category.name)),
  fetchCategories: () => dispatch(fetchCategories()),
  resetCategoryList: () => dispatch(resetCategoryList()),
  setNoneMode: () => dispatch(setNoneMode()),
  setMode: (newMode) => dispatch(setMode(newMode)),
  showConfirmation: (mode) => dispatch(showConfirmation(mode)),
  submitTicket: (payload) => dispatch(submitTicket(payload)),
  resetTicket: () => dispatch(resetSubmit()),
  hideConfirmation: () => dispatch(hideConfirmation())
});

export const CategoryManualList = connect(mapStateToProps, mapDispatchToProps)(List);
