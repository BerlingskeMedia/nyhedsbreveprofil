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
const Error = () => <div>Data unavailable</div>;

const ObjectToDetails = ({fields}) => {
  if (!fields) {
    return null;
  }

  return Object.keys(fields).map(fieldName => {
    const field = fields[fieldName];

    if (Array.isArray(field)) {
      return <DetailsItem key={fieldName} value={`[ ${field.join(', ')} ]`} allowEmpty>{fieldName}</DetailsItem>;
    }

    if (field !== null && typeof field === 'object') {
      return (
        <Fragment key={fieldName}>
          <DetailsItem allowEmpty>{fieldName}</DetailsItem>
          <div className="ml-2">
            <ObjectToDetails fields={field}/>
          </div>
        </Fragment>
      );
    }

    if (typeof field === 'boolean') {
      return <DetailsItem key={fieldName} value={field ? 'yes' : 'no'}>{fieldName}</DetailsItem>
    }

    if (['string', 'number'].includes(typeof field)) {
      return <DetailsItem key={fieldName} value={field} allowEmpty>{fieldName}</DetailsItem>;
    }

    return null;
  });
};

export const List = ({userInfo: {userInfo}}) => (
  <Fragment>
    <CategoriesList getId={({title}) => title}>
      <CategoryCard title="Register for log-in oplysninger (Login)" details={() => (
        <Fragment>
          <DetailsItem value={userInfo.profile.firstName && userInfo.profile.lastName && `${userInfo.profile.firstName} ${userInfo.profile.lastName}`}>name</DetailsItem>
          <DetailsItem value={userInfo.profile.email}>email</DetailsItem>
          <DetailsItem
            value={userInfo.profile.birthDay && userInfo.profile.birthMonth && userInfo.profile.birthYear && `${userInfo.profile.birthYear}-${userInfo.profile.birthMonth}-${userInfo.profile.birthDay}`}>
            date of birth
          </DetailsItem>
          <DetailsItem value={userInfo.profile.address}>address</DetailsItem>
          <DetailsItem value={userInfo.profile.zip}>zip code</DetailsItem>
          <DetailsItem value={userInfo.profile.city}>city</DetailsItem>
        </Fragment>
      )}/>

      <CategoryCard
        title="Register for Kundeoplysninger, Marketing og nyhedsbreve (Kundeoplysninger)"
        details={() => (
          <Fragment>
            <DetailsTitle>Kundeunivers</DetailsTitle>
            <CategoryApiCardItem
              fetchData={() => Api.get(`/mine-data/category/kundeunivers/${userInfo.UID}`)}
              renderError={Error}
              render={(data) => (
                <Fragment>
                  <DetailsTitle>Orders:</DetailsTitle>
                  {data.orders.map(order => order.items.map(item => (
                    <Fragment key={item.sap_order_id}>
                      <DetailsItem className="mt-4"
                                   value={item.product_family}>product</DetailsItem>
                      <DetailsItem value={item.delivery_address}>delivery
                        address</DetailsItem>
                      <DetailsItem value={item.subscription_type}>subscription
                        type</DetailsItem>
                      <DetailsItem value={item.status}>status</DetailsItem>
                      <DetailsItem value={item.expiration_date}>expiration
                        date</DetailsItem>
                      <DetailsItem value={item.billing_frequency}>billing
                        frequency</DetailsItem>
                    </Fragment>
                  )))}
                </Fragment>
              )}/>

            <DetailsSeparator/>

            <DetailsTitle>MDB</DetailsTitle>
            <CategoryApiCardItem
              fetchData={() => Api.get(`/mine-data/category/mdb/${userInfo.profile.email}`)}
              renderError={Error}
              render={(data) => (
                <Fragment>
                  <DetailsTitle>Personal information</DetailsTitle>
                  <DetailsItem value={data.profile.fornavn}>fornavn</DetailsItem>
                  <DetailsItem value={data.profile.efternavn}>efternavn</DetailsItem>
                  <DetailsItem value={data.profile.co_navn}>co navn</DetailsItem>
                  <DetailsItem value={data.profile.vejnavn}>vejnavn</DetailsItem>
                  <DetailsItem value={data.profile.husnummer}>husnummer</DetailsItem>
                  <DetailsItem value={data.profile.husbogstav}>husbogstav</DetailsItem>
                  <DetailsItem value={data.profile.etage}>etage</DetailsItem>
                  <DetailsItem value={data.profile.sidedoer}>sidedoer</DetailsItem>
                  <DetailsItem value={data.profile.stednavn}>stednavn</DetailsItem>
                  <DetailsItem value={data.profile.bynavn}>bynavn</DetailsItem>
                  <DetailsItem value={data.profile.postnummer}>postnummer</DetailsItem>
                  <DetailsItem value={data.profile.postnummer_dk}>postnummer dk</DetailsItem>
                  <DetailsItem value={data.profile.land}>land</DetailsItem>
                  <DetailsItem value={data.profile.firma}>firma</DetailsItem>
                  <DetailsItem value={data.profile.firma_adresse}>firma adresse</DetailsItem>
                  <DetailsItem value={data.profile.lande_kode}>lande kode</DetailsItem>
                  <DetailsItem value={data.profile.udland_flag}>udland flag</DetailsItem>
                  <DetailsItem value={data.profile.alder}>alder</DetailsItem>
                  <DetailsItem value={data.profile.foedselsaar}>foedselsaar</DetailsItem>
                  <DetailsItem value={data.profile.foedselsdato}>foedselsdato</DetailsItem>
                  <DetailsItem value={data.profile.koen}>koen</DetailsItem>
                  <DetailsItem value={data.profile.telefon}>telefon</DetailsItem>
                  <DetailsItem value={data.profile.mobil}>mobil</DetailsItem>
                  <DetailsItem value={data.profile.brugernavn}>brugernavn</DetailsItem>
                  <DetailsItem value={data.profile.adgangskode}>adgangskode</DetailsItem>
                  <DetailsItem value={data.profile.komvej_kode}>komvej kode</DetailsItem>
                  <DetailsItem value={data.profile.vilkaar}>vilkaar</DetailsItem>
                  <DetailsItem value={data.profile.status_kode}>status kode</DetailsItem>
                  <DetailsItem value={data.profile.bbs_abo_nr}>bbs abo nr</DetailsItem>
                  <DetailsItem value={data.profile.mol_bbs_nr}>mol bbs nr</DetailsItem>
                  <DetailsItem value={data.profile.robinson_flag}>robinson flag</DetailsItem>
                  <DetailsItem value={data.profile.insert_dato}>insert dato</DetailsItem>
                  <DetailsItem value={data.profile.activate_dato}>activate dato</DetailsItem>
                  <DetailsItem value={data.profile.opdatering_dato}>opdatering dato</DetailsItem>

                  <DetailsTitle>Nyhedsbreve</DetailsTitle>

                  {data.nyhedsbreve_list.length ? data.nyhedsbreve_list.map(newsletter => (
                    <Fragment key={newsletter.name}>
                      <div className="mt-4"><strong>{newsletter.name}</strong></div>
                      <DetailsItem value={newsletter.time}>time</DetailsItem>
                      <DetailsItem value={newsletter.description}>description</DetailsItem>
                    </Fragment>
                  )) : <div>No results</div>}

                  <DetailsTitle>Permissions</DetailsTitle>

                  {data.permission_list.length ? data.permission_list.map(permission => (
                    <Fragment key={permission.name}>
                      <div className="mt-4"><strong>{permission.name}</strong></div>
                      <DetailsItem value={permission.time}>time</DetailsItem>
                      <DetailsItem value={permission.description}>description</DetailsItem>
                    </Fragment>
                  )) : <div>No results</div>}

                  <DetailsTitle>Interesser</DetailsTitle>

                  {data.interesser_list.length ? data.interesser_list.map(interrest => (
                    <Fragment key={interrest.name}>
                      <div className="mt-4"><strong>{interrest.name}</strong></div>
                      <DetailsItem value={interrest.time}>time</DetailsItem>
                      <DetailsItem value={interrest.description}>description</DetailsItem>
                    </Fragment>
                  )) : <div>No results</div>}
                </Fragment>
              )}/>

            <DetailsSeparator/>

            <DetailsTitle>MailChimp</DetailsTitle>
            <CategoryApiCardItem
              fetchData={() => Api.get(`/mine-data/category/mailchimp/${userInfo.profile.email}`)}
              renderError={Error}
              render={(data) => data.map(({list_title, ...fields}) => (
                <Fragment key={list_title}>
                  <DetailsTitle>{list_title}</DetailsTitle>
                  <ObjectToDetails fields={fields}/>
                </Fragment>
              ))}/>
          </Fragment>
        )}/>
    </CategoriesList>
  </Fragment>
);

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const CategoryApiList = connect(mapStateToProps)(List);