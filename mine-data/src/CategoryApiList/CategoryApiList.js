import React, { Fragment } from 'react';
import { CategoryApiCardItem } from './CategoryApiCardItem';
import { Api } from '../common/api';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { DetailsItem } from '../Details/DetailsItem';
import { DetailsTitle } from '../Details/DetailsTitle';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { DetailsGroup } from '../Details/DetailsGroup';
import {
  resetKundeunivers, resetMailChimp, resetMDB,
  resetSurveyGizmo
} from './apiData.actions';

const CategoriesList = withCollapse(CategoryList);
const SubCategoriesList = withCollapse(({children}) => <div className="SubCategoryList">{children}</div>);
const Error = () => <div>Data utilgængelig</div>;
const SubCategoryCard = ({className, children, ...props}) => <CategoryCard className={classnames(className, 'SubCategoryCard')} details={() => children} {...props}/>;

export const List = ({userInfo: {userInfo, jwt}, apiData, resetMDB, resetMailChimp, resetSurveyGizmo}) => (
  <Fragment>
    <CategoriesList getId={({title}) => title}>
      <CategoryCard title="Register for log-in oplysninger" details={() => (
        <Fragment>
          <DetailsItem
            label="Navn"
            value={userInfo.profile.firstName && userInfo.profile.lastName && `${userInfo.profile.firstName} ${userInfo.profile.lastName}`}/>
          <DetailsItem label="E-mail" value={userInfo.profile.email}/>
          <DetailsItem label="Kaldenavn" value={userInfo.profile.nickname}/>
          <DetailsItem
            label="Fødselsdag"
            value={userInfo.profile.birthDay && userInfo.profile.birthMonth && userInfo.profile.birthYear && `${userInfo.profile.birthYear}-${userInfo.profile.birthMonth}-${userInfo.profile.birthDay}`}/>
          <DetailsItem label="Adresse" value={userInfo.profile.address}/>
          <DetailsItem label="Post nr." value={userInfo.profile.zip}/>
          <DetailsItem label="By" value={userInfo.profile.city}/>
          <DetailsItem label="Telefon" value={userInfo.profile.phones && userInfo.profile.phones.map(phone => phone.number).join(', ')}/>
          <DetailsItem label="Alder" value={userInfo.profile.age}/>
          <DetailsItem label="Bio" value={userInfo.profile.bio}/>
          <DetailsItem label="Fødselsdag" value={userInfo.profile.birthDay}/>
          <DetailsItem label="Fødselsmåned" value={userInfo.profile.birthMonth}/>
          <DetailsItem label="Fødselsår" value={userInfo.profile.birthYear}/>
          <DetailsItem label="Capabilities" value={userInfo.profile.capabilities}/>
          <DetailsItem label="Certifications" value={userInfo.profile.certifications}/>
          <DetailsItem label="Land" value={userInfo.profile.country}/>
          <DetailsItem label="Uddannelse" value={userInfo.profile.education}/>
          <DetailsItem label="Education level" value={userInfo.profile.educationLevel}/>
          <DetailsItem label="Favoritter" value={userInfo.profile.favorites}/>
          <DetailsItem label="Followers count" value={userInfo.profile.followersCount}/>
          <DetailsItem label="Following count" value={userInfo.profile.followingCount}/>
          <DetailsItem label="Køn" value={userInfo.profile.gender}/>
          <DetailsItem label="Hjemby" value={userInfo.profile.hometown}/>
          <DetailsItem label="Honors" value={userInfo.profile.honors}/>
          <DetailsItem label="Identities" value={userInfo.profile.identities}/>
          <DetailsItem label="Industri" value={userInfo.profile.industry}/>
          <DetailsItem label="Interested in" value={userInfo.profile.interestedIn}/>
          <DetailsItem label="Interesser" value={userInfo.profile.interests}/>
          <DetailsItem label="Aktivitetter" value={userInfo.profile.activities}/>
          <DetailsItem label="iRank" value={userInfo.profile.iRank}/>
          <DetailsItem label="Sprog" value={userInfo.profile.languages}/>
          <DetailsItem label="Likes" value={userInfo.profile.likes}/>
          <DetailsItem label="Locale" value={userInfo.profile.locale}/>
          <DetailsItem label="Navn" value={userInfo.profile.name}/>
          <DetailsItem label="Patents" value={userInfo.profile.patents}/>
          <DetailsItem label="Photo URL" value={userInfo.profile.photoURL}/>
          <DetailsItem label="Political view" value={userInfo.profile.politicalView}/>
          <DetailsItem label="Professional headline" value={userInfo.profile.professionalHeadline}/>
          <DetailsItem label="Profile URL" value={userInfo.profile.profileURL}/>
          <DetailsItem label="Udgivelser" value={userInfo.profile.publications}/>
          <DetailsItem label="Relationship status" value={userInfo.profile.relationshipStatus}/>
          <DetailsItem label="Religion" value={userInfo.profile.religion}/>
          <DetailsItem label="Skills" value={userInfo.profile.skills}/>
          <DetailsItem label="Specialiteter" value={userInfo.profile.specialities}/>
          <DetailsItem label="Stat" value={userInfo.profile.state}/>
          <DetailsItem label="Tidszone" value={userInfo.profile.timezone}/>
          <DetailsItem label="Thumbnail URL" value={userInfo.profile.thumbnailURL}/>
          <DetailsItem label="Username" value={userInfo.profile.username}/>
          <DetailsItem label="Arbejde" value={userInfo.profile.work}/>
        </Fragment>
      )}/>

      <CategoryCard
        title="Register for Kundeoplysninger, Marketing og nyhedsbreve"
        details={() => (
          <SubCategoriesList getId={({title}) => title}>
            <CategoryApiCardItem
              title="Abonnementsoplysninger"
              pending={apiData.kundeunivers.pending}
              hasError={apiData.kundeunivers.error}
              hasData={apiData.kundeunivers.data && apiData.kundeunivers.data.orders && apiData.kundeunivers.data.orders.length > 0}
              renderError={Error}
              render={() => apiData.kundeunivers.data.orders.map(order => order.items.map(item => (
                <DetailsGroup key={item.sap_order_id}>
                  <DetailsItem value={item.product_family} label="Produkt"/>
                  <DetailsItem value={item.delivery_address} label="Leveringsadresse"/>
                  <DetailsItem value={item.subscription_type} label="Abonnementstype"/>
                  <DetailsItem value={item.status} label="Status"/>
                  <DetailsItem value={item.expiration_date} label="Udløbsdato"/>
                  <DetailsItem value={item.billing_frequency} label="Betalingsfrekvens"/>
                </DetailsGroup>
              )))}/>

            <CategoryApiCardItem
              title="Samtykker"
              pending={apiData.mdb.pending}
              hasError={apiData.mdb.error}
              hasData={apiData.mdb.data && apiData.mdb.data.permission_list && apiData.mdb.data.permission_list.length > 0}
              renderError={Error}
              render={() => apiData.mdb.data.permission_list.map(permission => (
                <DetailsGroup
                  key={permission.name}
                  deleteAction={() => Api
                    .delete(`/mine-data/category/mdb/permissions/${permission.id}`, jwt)
                    .then(() => resetMDB())
                  }>
                  <DetailsTitle>{permission.name}</DetailsTitle>
                  <DetailsItem value={permission.time} label="Tid"/>
                  <DetailsItem value={permission.description} label="Beskrivelse"/>
                </DetailsGroup>
              ))}/>

            <CategoryApiCardItem
              title="Nyhedsbreve"
              pending={apiData.mdb.pending || apiData.mdb.pending}
              hasError={apiData.mdb.error && apiData.mdb.error}
              hasData={(apiData.mdb.data && apiData.mdb.data.nyhedsbreve_list && apiData.mdb.data.nyhedsbreve_list.length > 0)}
              render={() => (
                <Fragment>
                  {apiData.mdb.data.nyhedsbreve_list.map(newsletter => (
                    <DetailsGroup
                      key={newsletter.name}
                      deleteAction={() => Api
                        .delete(`/mine-data/category/mdb/nyhedsbreve/${newsletter.id}`, jwt)
                        .then(() => resetMDB())}>
                      <DetailsTitle>{newsletter.name}</DetailsTitle>
                      <DetailsItem value={newsletter.time} label="Tid"/>
                      <DetailsItem value={newsletter.description} label="Beskrivelse"/>
                    </DetailsGroup>
                  ))}
                </Fragment>
              )}/>

            <CategoryApiCardItem
              title="Interesser"
              pending={apiData.mdb.pending}
              hasError={apiData.mdb.error}
              hasData={apiData.mdb.data && apiData.mdb.data.interesser_list && apiData.mdb.data.interesser_list.length > 0}
              renderError={Error}
              render={() => apiData.mdb.data.interesser_list.map(interest => (
                <DetailsGroup
                  key={interest.name}
                  deleteAction={() => Api
                    .delete(`/mine-data/category/mdb/interesser/${interest.id}`, jwt)
                    .then(() => resetMDB())}>
                  <DetailsTitle>{interest.name}</DetailsTitle>
                </DetailsGroup>
              ))}/>

            <CategoryApiCardItem
              title="Marketing information"
              pending={apiData.mdb.pending}
              hasError={apiData.mdb.error}
              hasData={apiData.mdb.data && apiData.mdb.data.profile && Object.keys(apiData.mdb.data.profile).length > 0}
              renderError={Error}
              render={() => (
                <DetailsGroup>
                  <DetailsItem value={apiData.mdb.data.profile.fornavn} label="Fornavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.efternavn} label="Efternavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.co_navn} label="CO navn"/>
                  <DetailsItem value={apiData.mdb.data.profile.vejnavn} label="Vejnavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.husnummer} label="Husnummer"/>
                  <DetailsItem value={apiData.mdb.data.profile.husbogstav} label="Husbogstav"/>
                  <DetailsItem value={apiData.mdb.data.profile.etage} label="Etage"/>
                  <DetailsItem value={apiData.mdb.data.profile.sidedoer} label="Sidedoer"/>
                  <DetailsItem value={apiData.mdb.data.profile.stednavn} label="Stednavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.bynavn} label="Bynavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.postnummer} label="Postnummer"/>
                  <DetailsItem value={apiData.mdb.data.profile.postnummer_dk} label="Postnummer dk"/>
                  <DetailsItem value={apiData.mdb.data.profile.land} label="Land"/>
                  <DetailsItem value={apiData.mdb.data.profile.firma} label="Firma"/>
                  <DetailsItem value={apiData.mdb.data.profile.firma_adresse} label="Firma adresse"/>
                  <DetailsItem value={apiData.mdb.data.profile.lande_kode} label="Lande kode"/>
                  <DetailsItem value={apiData.mdb.data.profile.udland_flag} label="Udland flag"/>
                  <DetailsItem value={apiData.mdb.data.profile.alder} label="Alder"/>
                  <DetailsItem value={apiData.mdb.data.profile.foedselsaar} label="Foedselsaar"/>
                  <DetailsItem value={apiData.mdb.data.profile.foedselsdato} label="Foedselsdato"/>
                  <DetailsItem value={apiData.mdb.data.profile.koen} label="Koen"/>
                  <DetailsItem value={apiData.mdb.data.profile.telefon} label="Telefon"/>
                  <DetailsItem value={apiData.mdb.data.profile.mobil} label="Mobil"/>
                  <DetailsItem value={apiData.mdb.data.profile.brugernavn} label="Brugernavn"/>
                  <DetailsItem value={apiData.mdb.data.profile.adgangskode} label="Adgangskode"/>
                  <DetailsItem value={apiData.mdb.data.profile.komvej_kode} label="Komvej kode"/>
                  <DetailsItem value={apiData.mdb.data.profile.vilkaar} label="Vilkaar"/>
                  <DetailsItem value={apiData.mdb.data.profile.status_kode} label="Status kode"/>
                  <DetailsItem value={apiData.mdb.data.profile.bbs_abo_nr} label="BBS abo nr"/>
                  <DetailsItem value={apiData.mdb.data.profile.mol_bbs_nr} label="Mol bbs nr"/>
                  <DetailsItem value={apiData.mdb.data.profile.robinson_flag} label="Robinson flag"/>
                  <DetailsItem value={apiData.mdb.data.profile.insert_dato} label="Insert dato"/>
                  <DetailsItem value={apiData.mdb.data.profile.activate_dato} label="Activate dato"/>
                  <DetailsItem value={apiData.mdb.data.profile.opdatering_dato} label="Opdatering dato"/>
                </DetailsGroup>
                )}/>

            <CategoryApiCardItem
              title="Spørgeskemaer/konkurrencer"
              pending={apiData.surveyGizmo.pending}
              hasError={apiData.surveyGizmo.error}
              hasData={apiData.surveyGizmo.data && apiData.surveyGizmo.data.length > 0}
              renderError={Error}
              render={() => apiData.surveyGizmo.data.map(survey => (
                <DetailsGroup
                  key={`${survey.response_id}${survey.survey_id}`}
                  deleteAction={() => Api
                    .delete(`/mine-data/category/surveygizmo/${survey.survey_id}/${survey.response_id}`, jwt)
                    .then(() => resetSurveyGizmo())}>
                  <DetailsItem value={survey.city} label="By"/>
                  <DetailsItem value={survey.country} label="Country"/>
                  <DetailsItem value={survey.date} label="Dato"/>
                  <DetailsItem value={survey.date_submitted} label="indsendelsesdato"/>
                  <DetailsItem value={survey.dma} label="Udbyder"/>
                  <DetailsItem value={survey.email} label="E-mail"/>
                  <DetailsItem value={survey.ip_address} label="IP adresse"/>
                  <DetailsItem value={survey.language} label="Sprog"/>
                  <DetailsItem value={survey.latitude} label="breddegrad"/>
                  <DetailsItem value={survey.longitude} label="Længdegrad"/>
                  <DetailsItem value={survey.postal} label="Post nr."/>
                  <DetailsItem value={survey.referer} label="Url"/>
                  <DetailsItem value={survey.region} label="Region"/>
                  <DetailsItem value={survey.response_id} label="Response_id"/>
                  <DetailsItem value={survey.survey_id} label="Survey_id"/>
                  <DetailsItem value={survey.survey_name} label="Navn på survey"/>
                  <DetailsItem value={survey.user_agent} label="User agent"/>

                  <DetailsItem label="Dine svar" className="mt-2"
                               value={survey.survey_data.map(qa => <DetailsItem key={qa.q} label={qa.q} value={qa.a}/>)}/>
                </DetailsGroup>
              ))}/>
          </SubCategoriesList>
        )}/>
    </CategoriesList>
  </Fragment>
);

const mapStateToProps = ({apiData, userInfo}) => ({
  apiData,
  userInfo
});

const mapDispatchToProps = dispatch => ({
  resetKundeunivers: dispatch(resetKundeunivers()),
  resetMDB: dispatch(resetMDB()),
  resetMailChimp: dispatch(resetMailChimp()),
  resetSurveyGizmo: dispatch(resetSurveyGizmo())
});

export const CategoryApiList = connect(mapStateToProps, mapDispatchToProps)(List);