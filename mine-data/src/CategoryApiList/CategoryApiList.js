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
import SubmitButton from '../SubmitButton/SubmitButton';

const CategoriesList = withCollapse(CategoryList);
const Error = () => <div>Data unavailable</div>;

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
              sideNav={() => <a className="btn btn-secondary">Delete data</a>}
              render={(data) => (
                <Fragment>
                  <DetailsTitle>Orders:</DetailsTitle>
                  {data.orders.map(order => order.items.map(item => (
                    <Fragment key={item.sap_order_id}>
                      <DetailsItem className="mt-4" label="product"
                                   value={item.product_family}/>
                      <DetailsItem value={item.delivery_address} label="delivery address"/>
                      <DetailsItem value={item.subscription_type} label="subscription type"/>
                      <DetailsItem value={item.status} label="status"/>
                      <DetailsItem value={item.expiration_date} label="expiration date"/>
                      <DetailsItem value={item.billing_frequency} label="billing frequency"/>
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
                  <DetailsItem value={data.profile.fornavn} label="fornavn"/>
                  <DetailsItem value={data.profile.efternavn} label="efternavn"/>
                  <DetailsItem value={data.profile.co_navn} label="co navn"/>
                  <DetailsItem value={data.profile.vejnavn} label="vejnavn"/>
                  <DetailsItem value={data.profile.husnummer} label="husnummer"/>
                  <DetailsItem value={data.profile.husbogstav} label="husbogstav"/>
                  <DetailsItem value={data.profile.etage} label="etage"/>
                  <DetailsItem value={data.profile.sidedoer} label="sidedoer"/>
                  <DetailsItem value={data.profile.stednavn} label="stednavn"/>
                  <DetailsItem value={data.profile.bynavn} label="bynavn"/>
                  <DetailsItem value={data.profile.postnummer} label="postnummer"/>
                  <DetailsItem value={data.profile.postnummer_dk} label="postnummer dk"/>
                  <DetailsItem value={data.profile.land} label="land"/>
                  <DetailsItem value={data.profile.firma} label="firma"/>
                  <DetailsItem value={data.profile.firma_adresse} label="firma adresse"/>
                  <DetailsItem value={data.profile.lande_kode} label="lande kode"/>
                  <DetailsItem value={data.profile.udland_flag} label="udland flag"/>
                  <DetailsItem value={data.profile.alder} label="alder"/>
                  <DetailsItem value={data.profile.foedselsaar} label="foedselsaar"/>
                  <DetailsItem value={data.profile.foedselsdato} label="foedselsdato"/>
                  <DetailsItem value={data.profile.koen} label="koen"/>
                  <DetailsItem value={data.profile.telefon} label="telefon"/>
                  <DetailsItem value={data.profile.mobil} label="mobil"/>
                  <DetailsItem value={data.profile.brugernavn} label="brugernavn"/>
                  <DetailsItem value={data.profile.adgangskode} label="adgangskode"/>
                  <DetailsItem value={data.profile.komvej_kode} label="komvej kode"/>
                  <DetailsItem value={data.profile.vilkaar} label="vilkaar"/>
                  <DetailsItem value={data.profile.status_kode} label="status kode"/>
                  <DetailsItem value={data.profile.bbs_abo_nr} label="bbs abo nr"/>
                  <DetailsItem value={data.profile.mol_bbs_nr} label="mol bbs nr"/>
                  <DetailsItem value={data.profile.robinson_flag} label="robinson flag"/>
                  <DetailsItem value={data.profile.insert_dato} label="insert dato"/>
                  <DetailsItem value={data.profile.activate_dato} label="activate dato"/>
                  <DetailsItem value={data.profile.opdatering_dato} label="opdatering dato"/>

                  <DetailsTitle>Nyhedsbreve</DetailsTitle>

                  {data.nyhedsbreve_list.length ? data.nyhedsbreve_list.map(newsletter => (
                    <Fragment key={newsletter.name}>
                      <div className="mt-4"><strong>{newsletter.name}</strong></div>
                      <DetailsItem value={newsletter.time} label="time"/>
                      <DetailsItem value={newsletter.description} label="description"/>
                    </Fragment>
                  )) : <div>No results</div>}

                  <DetailsTitle>Permissions</DetailsTitle>

                  {data.permission_list.length ? data.permission_list.map(permission => (
                    <Fragment key={permission.name}>
                      <div className="mt-4"><strong>{permission.name}</strong></div>
                      <DetailsItem value={permission.time} label="time"/>
                      <DetailsItem value={permission.description} label="description"/>
                    </Fragment>
                  )) : <div>No results</div>}

                  <DetailsTitle>Interesser</DetailsTitle>

                  {data.interesser_list.length ? data.interesser_list.map(interrest => (
                    <Fragment key={interrest.name}>
                      <div className="mt-4"><strong>{interrest.name}</strong></div>
                      <DetailsItem value={interrest.time} label="time"/>
                      <DetailsItem value={interrest.description} label="description"/>
                    </Fragment>
                  )) : <div>No results</div>}
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
                  <ObjectToDetails fields={fields}/>
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