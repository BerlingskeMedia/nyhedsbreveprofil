import React, { Fragment } from 'react';
import { CategoryManualList } from '../CategoryManualList/CategoryManualList';
import { CategoryApiList } from '../CategoryApiList/CategoryApiList';
import { DeleteAll } from '../DeleteAll/DeleteAll';
import { connect } from 'react-redux';
import {
  fetchKundeunivers, fetchMailChimp,
  fetchMDB, fetchSurveyGizmo
} from '../CategoryApiList/apiData.actions';

class Home extends React.Component {
  componentWillReceiveProps({apiData, fetchKundeunivers, fetchMDB, fetchMailChimp, fetchSurveyGizmo}) {
    if (!apiData.kundeunivers.pending && !apiData.kundeunivers.data && !apiData.kundeunivers.error) {
      fetchKundeunivers();
    }

    if (!apiData.mdb.pending && !apiData.mdb.data && !apiData.mdb.error) {
      fetchMDB();
    }

    if (!apiData.mailChimp.pending && !apiData.mailChimp.data && !apiData.mailChimp.error) {
      fetchMailChimp();
    }

    if (!apiData.surveyGizmo.pending && !apiData.surveyGizmo.data && !apiData.surveyGizmo.error) {
      fetchSurveyGizmo();
    }
  }

  render() {
    return (
      <Fragment>
        <p>
          Vi kan kun finde frem til dine data på baggrund af de oplysninger vi har
          på dig. Dem kan du se herunder. Hvis du ønsker at tilføje yderligere
          oplysninger til din Berlingske Media konto kan du gøre dette på vore
          selvbetjeningssider på de forskellige sites.
        </p>
        <p>Ved at klikke på nedenstående kategorier kan du se de persondata, som
          vi gemmer om dig.</p>
        <CategoryApiList/>
        <p>
          Det kan forekomme at vi har data på dig i nedenstående kategorier. Du
          har derfor mulighed for at anmode om manuel indsigt eller sletning i
          disse kategorier, som vi herefter vil levere til dig på mail inden for
          30 dage.
        </p>
        <CategoryManualList/>
        <DeleteAll/>
      </Fragment>
    );
  }
}

const mapStateToProps = ({apiData}) => ({
  apiData
});

const mapDispatchToProps = dispatch => ({
  fetchKundeunivers: () => dispatch(fetchKundeunivers()),
  fetchMDB: () => dispatch(fetchMDB()),
  fetchMailChimp: () => dispatch(fetchMailChimp()),
  fetchSurveyGizmo: () => dispatch(fetchSurveyGizmo())
});

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(Home);