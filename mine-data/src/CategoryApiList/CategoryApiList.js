import React, { Fragment } from 'react';
import { CategoryApiCardItem } from './CategoryApiCardItem';
import { Api } from '../common/api';
import { connect } from 'react-redux';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { DetailsItem } from '../Details/DetailsItem';
import { DetailsTitle } from '../Details/DetailsTitle';
import { DetailsSeparator } from '../Details/DetailsSeparator';
import { CategoryCard } from '../CategoryCard/CategoryCard';

const CategoriesList = withCollapse(CategoryList);
const Error = () => <div>Data utilgængelig</div>;

const ObjectToDetails = ({fields}) => {
  if (!fields) {
    return null;
  }

  return Object.keys(fields).map(fieldName => {
    const field = fields[fieldName];

    if (Array.isArray(field)) {
      return <DetailsItem key={fieldName} value={`[ ${field.join(', ')} ]`} allowEmpty label={fieldName}/>;
    }

    if (field !== null && typeof field === 'object') {
      return (
        <Fragment key={fieldName}>
          <DetailsItem allowEmpty label={fieldName}/>
          <div className="ml-2">
            <ObjectToDetails fields={field}/>
          </div>
        </Fragment>
      );
    }

    if (typeof field === 'boolean') {
      return <DetailsItem key={fieldName} value={field ? 'yes' : 'no'} label={fieldName}/>;
    }

    if (['string', 'number'].includes(typeof field)) {
      return <DetailsItem key={fieldName} value={field} allowEmpty label={fieldName}/>;
    }

    return null;
  });
};

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
          <Fragment>
            <CategoryApiCardItem
              title="Kundeunivers"
              fetchData={() => Api.get(`/mine-data/category/kundeunivers/${userInfo.UID}`)}
              renderError={Error}
              render={(data) => (
                <Fragment>
                  <DetailsTitle>Orders:</DetailsTitle>
                  {data.orders.map(order => order.items.map(item => (
                    <Fragment key={item.sap_order_id}>
                      <DetailsItem className="mt-4" value={item.product_family} label="Produkt"/>
                      <DetailsItem value={item.delivery_address} label="Leveringsadresse"/>
                      <DetailsItem value={item.subscription_type} label="Abonnementstype"/>
                      <DetailsItem value={item.status} label="Status"/>
                      <DetailsItem value={item.expiration_date} label="Udløbsdato"/>
                      <DetailsItem value={item.billing_frequency} label="Betalingsfrekvens"/>
                    </Fragment>
                  )))}
                </Fragment>
              )}/>

            <DetailsSeparator/>

            <CategoryApiCardItem
              title="MDB"
              fetchData={() => Api.get(`/mine-data/category/mdb/${userInfo.profile.email}`)}
              renderError={Error}
              render={(data) => (
                <Fragment>
                  <DetailsTitle>Personal information</DetailsTitle>
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

                  <DetailsTitle>Nyhedsbreve</DetailsTitle>

                  {data.nyhedsbreve_list.length ? data.nyhedsbreve_list.map(newsletter => (
                    <Fragment key={newsletter.name}>
                      <div className="mt-4"><strong>{newsletter.name}</strong></div>
                      <DetailsItem value={newsletter.time} label="Tid"/>
                      <DetailsItem value={newsletter.description} label="Beskrivelse"/>
                    </Fragment>
                  )) : <div>Ingen data registreret</div>}

                  <DetailsTitle>Samtykker</DetailsTitle>

                  {data.permission_list.length ? data.permission_list.map(permission => (
                    <Fragment key={permission.name}>
                      <div className="mt-4"><strong>{permission.name}</strong></div>
                      <DetailsItem value={permission.time} label="Tid"/>
                      <DetailsItem value={permission.description} label="Beskrivelse"/>
                    </Fragment>
                  )) : <div>Ingen data registreret</div>}

                  <DetailsTitle>Interesser</DetailsTitle>

                  {data.interesser_list.length ? data.interesser_list.map(interrest => (
                    <Fragment key={interrest.name}>
                      <div className="mt-4"><strong>{interrest.name}</strong></div>
                      <DetailsItem value={interrest.time} label="Tid"/>
                      <DetailsItem value={interrest.description} label="Beskrivelse"/>
                    </Fragment>
                  )) : <div>Ingen data registreret</div>}
                </Fragment>
              )}/>

            <DetailsSeparator/>

            <CategoryApiCardItem
              title="MailChimp"
              fetchData={() => Api.get(`/mine-data/category/mailchimp/${userInfo.profile.email}`)}
              renderError={Error}
              render={(data) => data.map(({list_title, ...fields}) => (
                <Fragment key={list_title}>
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
                  <DetailsItem label="Aktiviteter" allowEmpty/>
                  {fields.activity.map(activityItem => (
                    <Fragment>
                      <DetailsItem value={activityItem.bounce} label="Bounce"/>
                      <DetailsItem value={activityItem.campaign_id} label="Campaign ID"/>
                      <DetailsItem value={activityItem.timestamp} label="Tidsstempel"/>
                      <DetailsItem value={activityItem.title} label="Titel"/>
                      <DetailsItem value={activityItem.type} label="Type"/>
                    </Fragment>
                  ))}
                </Fragment>
              ))}/>

            <DetailsSeparator/>

            <CategoryApiCardItem
              title="Survey Gizmo"
              fetchData={() => Api.get(`/mine-data/category/surveygizmo/${userInfo.profile.email}`)}
              renderError={Error}
              render={data => {
                <div/>
              }}/>
          </Fragment>
        )}/>
    </CategoriesList>
  </Fragment>
);

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const CategoryApiList = connect(mapStateToProps)(List);