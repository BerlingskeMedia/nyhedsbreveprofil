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

const CategoriesList = withCollapse(CategoryList);
const SubCategoriesList = withCollapse(({children}) => <div className="SubCategoryList">{children}</div>);
const Error = () => <div>Data utilgængelig</div>;
const SubCategoryCard = ({className, children, ...props}) => <CategoryCard className={classnames(className, 'SubCategoryCard')} details={() => children} {...props}/>;

export const List = ({userInfo: {userInfo}}) => (
  <Fragment>
    <CategoriesList getId={({title}) => title}>
      <CategoryCard title="Register for log-in oplysninger" details={() => (
        <Fragment>
          <DetailsItem
            label="Navn"
            value={userInfo.profile.firstName && userInfo.profile.lastName && `${userInfo.profile.firstName} ${userInfo.profile.lastName}`}/>
          <DetailsItem label="E-mail" value={userInfo.profile.email}/>
          <DetailsItem
            label="Fødselsdag"
            value={userInfo.profile.birthDay && userInfo.profile.birthMonth && userInfo.profile.birthYear && `${userInfo.profile.birthYear}-${userInfo.profile.birthMonth}-${userInfo.profile.birthDay}`}/>
          <DetailsItem label="Adresse" value={userInfo.profile.address}/>
          <DetailsItem label="Post nr." value={userInfo.profile.zip}/>
          <DetailsItem label="By" value={userInfo.profile.city}/>
        </Fragment>
      )}/>

      <CategoryCard
        title="Register for Kundeoplysninger, Marketing og nyhedsbreve"
        details={() => (
          <SubCategoriesList getId={({title}) => title}>
            <CategoryApiCardItem
              title="Abonnementsoplysninger"
              fetchData={() => Api.get(`/mine-data/category/kundeunivers/${userInfo.UID}`)}
              renderError={Error}
              hasData={data => data.orders && data.orders.length > 0}
              render={({data}) => data.orders.map(order => order.items.map(item => (
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
              fetchData={() => Api.getCached(`/mine-data/category/mdb/${userInfo.profile.email}`)}
              renderError={Error}
              hasData={data => data.permission_list && data.permission_list.length > 0}
              render={({data, resetData}) => data.permission_list.map(permission => (
                <DetailsGroup
                  key={permission.name}
                  deleteAction={() => Api
                    .delete(`/backend/users/${data.profile.user_id}/permissions/${permission.id}?location_id=5`)
                    .then(() => resetData())
                  }>
                  <DetailsTitle>{permission.name}</DetailsTitle>
                  <DetailsItem value={permission.time} label="Tid"/>
                  <DetailsItem value={permission.description} label="Beskrivelse"/>
                </DetailsGroup>
              ))}/>

            <CategoryApiCardItem
              title="Nyhedsbreve"
              fetchData={() => Promise.all([
                Api.getCached(`/mine-data/category/mdb/${userInfo.profile.email}`),
                Api.get(`/mine-data/category/mailchimp/${userInfo.profile.email}`)
              ])}
              hasData={([mdb, mailChimp]) => (mdb.nyhedsbreve_list && mdb.nyhedsbreve_list.length > 0) || (mailChimp && mailChimp.length > 0)}
              render={({data: [mdb, mailChimp], resetData}) => (
                <Fragment>
                  {mdb.nyhedsbreve_list.map(newsletter => (
                    <DetailsGroup
                      key={newsletter.name}
                      deleteAction={() => Api
                        .delete(`/backend/users/${mdb.profile.user_id}/nyhedsbreve/${newsletter.id}?location_id=5`)
                        .then(() => resetData())}>
                      <DetailsTitle>{newsletter.name}</DetailsTitle>
                      <DetailsItem value={newsletter.time} label="Tid"/>
                      <DetailsItem value={newsletter.description} label="Beskrivelse"/>
                    </DetailsGroup>
                  ))}

                  {mailChimp.map(({list_title, ...fields}) => (
                    <DetailsGroup
                      key={list_title}
                      deleteAction={() => Api
                        .delete(`/mine-data/category/mailchimp/${fields.list_id}/${fields.id}`)
                        .then(() => resetData())}>
                      <DetailsTitle>{list_title}</DetailsTitle>
                      <DetailsItem value={fields.email_address} label="E-mail"/>
                      <DetailsItem value={fields.unique_email_id} label="Unique email ID"/>
                      <DetailsItem value={fields.email_type} label="Email type"/>
                      <DetailsItem value={fields.status} label="Satus"/>
                      <DetailsItem value={fields.merge_fields.FNAME} label="Fornavn"/>
                      <DetailsItem value={fields.merge_fields.LNAME} label="Efternavn"/>
                      <DetailsItem value={fields.stats.avg_open_rate} label="Avg open rate"/>
                      <DetailsItem value={fields.stats.avg_click_rate} label="Avg click rate"/>
                      <DetailsItem value={fields.ip_signup} label="IP adresse"/>
                      <DetailsItem value={fields.timestamp_signup} label="Tidsstempel signup"/>
                      <DetailsItem value={fields.ip_opt} label="IP opt"/>
                      <DetailsItem value={fields.timestamp_opt} label="Tidsstempel opt"/>
                      <DetailsItem value={fields.member_rating} label="Rangering"/>
                      <DetailsItem value={fields.last_changed} label="Sidste ændring"/>
                      <DetailsItem value={fields.language} label="Sprog"/>
                      <DetailsItem value={fields.vip} label="VIP"/>
                      <DetailsItem value={fields.email_client} label="Email client"/>
                      <DetailsItem label="Lokation" allowEmpty/>
                      <DetailsItem value={fields.location.latitude} label="Latitude"/>
                      <DetailsItem value={fields.location.longitude} label="Longitude"/>
                      <DetailsItem value={fields.location.gmtoff} label="GMT off"/>
                      <DetailsItem value={fields.location.dstoff} label="DST off"/>
                      <DetailsItem value={fields.location.country_code} label="Country code"/>
                      <DetailsItem value={fields.location.timezone} label="Timezone"/>
                      <DetailsItem label="Aktiviteter" className="mt-2" allowEmpty/>
                      {fields.activity.map(activityItem => (
                        <div className="mt-2 ml-2" key={activityItem.timestamp}>
                          <DetailsItem value={activityItem.bounce} label="Bounce"/>
                          <DetailsItem value={activityItem.campaign_id} label="Campaign ID"/>
                          <DetailsItem value={activityItem.timestamp} label="Tidsstempel"/>
                          <DetailsItem value={activityItem.title} label="Titel"/>
                          <DetailsItem value={activityItem.type} label="Type"/>
                        </div>
                      ))}
                    </DetailsGroup>
                  ))}
                </Fragment>
              )}/>

            <CategoryApiCardItem
              title="Interesser"
              fetchData={() => Api.getCached(`/mine-data/category/mdb/${userInfo.profile.email}`)}
              renderError={Error}
              hasData={data => data.interesser_list && data.interesser_list.length > 0}
              render={({data, resetData}) => data.interesser_list.map(interest => (
                <DetailsGroup
                  key={interest.name}
                  deleteAction={() => Api
                    .delete(`/backend/users/${data.profile.user_id}/interesser/${interest.id}?location_id=5`)
                    .then(() => resetData())}>
                  <DetailsTitle>{interest.name}</DetailsTitle>
                  <DetailsItem value={interest.time} label="Tid"/>
                  <DetailsItem value={interest.description} label="Beskrivelse"/>
                </DetailsGroup>
              ))}/>

            <CategoryApiCardItem
              title="Marketing information"
              fetchData={() => Api.getCached(`/mine-data/category/mdb/${userInfo.profile.email}`)}
              renderError={Error}
              hasData={data => data.profile && Object.keys(data.profile).length > 0}
              render={({data}) => (
                <DetailsGroup>
                  <DetailsItem value={data.profile.fornavn} label="Fornavn"/>
                  <DetailsItem value={data.profile.efternavn} label="Efternavn"/>
                  <DetailsItem value={data.profile.co_navn} label="CO navn"/>
                  <DetailsItem value={data.profile.vejnavn} label="Vejnavn"/>
                  <DetailsItem value={data.profile.husnummer} label="Husnummer"/>
                  <DetailsItem value={data.profile.husbogstav} label="Husbogstav"/>
                  <DetailsItem value={data.profile.etage} label="Etage"/>
                  <DetailsItem value={data.profile.sidedoer} label="Sidedoer"/>
                  <DetailsItem value={data.profile.stednavn} label="Stednavn"/>
                  <DetailsItem value={data.profile.bynavn} label="Bynavn"/>
                  <DetailsItem value={data.profile.postnummer} label="Postnummer"/>
                  <DetailsItem value={data.profile.postnummer_dk} label="Postnummer dk"/>
                  <DetailsItem value={data.profile.land} label="Land"/>
                  <DetailsItem value={data.profile.firma} label="Firma"/>
                  <DetailsItem value={data.profile.firma_adresse} label="Firma adresse"/>
                  <DetailsItem value={data.profile.lande_kode} label="Lande kode"/>
                  <DetailsItem value={data.profile.udland_flag} label="Udland flag"/>
                  <DetailsItem value={data.profile.alder} label="Alder"/>
                  <DetailsItem value={data.profile.foedselsaar} label="Foedselsaar"/>
                  <DetailsItem value={data.profile.foedselsdato} label="Foedselsdato"/>
                  <DetailsItem value={data.profile.koen} label="Koen"/>
                  <DetailsItem value={data.profile.telefon} label="Telefon"/>
                  <DetailsItem value={data.profile.mobil} label="Mobil"/>
                  <DetailsItem value={data.profile.brugernavn} label="Brugernavn"/>
                  <DetailsItem value={data.profile.adgangskode} label="Adgangskode"/>
                  <DetailsItem value={data.profile.komvej_kode} label="Komvej kode"/>
                  <DetailsItem value={data.profile.vilkaar} label="Vilkaar"/>
                  <DetailsItem value={data.profile.status_kode} label="Status kode"/>
                  <DetailsItem value={data.profile.bbs_abo_nr} label="BBS abo nr"/>
                  <DetailsItem value={data.profile.mol_bbs_nr} label="Mol bbs nr"/>
                  <DetailsItem value={data.profile.robinson_flag} label="Robinson flag"/>
                  <DetailsItem value={data.profile.insert_dato} label="Insert dato"/>
                  <DetailsItem value={data.profile.activate_dato} label="Activate dato"/>
                  <DetailsItem value={data.profile.opdatering_dato} label="Opdatering dato"/>
                </DetailsGroup>
                )}/>

            <CategoryApiCardItem
              title="Spørgeskemaer/konkurrencer"
              fetchData={() => Api.get(`/mine-data/category/surveygizmo/${userInfo.profile.email}`)}
              renderError={Error}
              hasData={data => data.length > 0}
              render={({data, resetData}) => data.map(survey => (
                <DetailsGroup
                  key={`${survey.response_id}${survey.survey_id}`}
                  deleteAction={() => Api
                    .delete(`/mie-data/category/surveygizmo/${survey.survey_id}/${userInfo.profile.email}/${survey.response_id}`)
                    .then(() => resetData())}>
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

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const CategoryApiList = connect(mapStateToProps)(List);