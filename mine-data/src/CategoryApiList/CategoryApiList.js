import React, {Fragment} from 'react';
import { CategoryApiCard } from './CategoryApiCard';
import { Api } from '../common/api';
import { connect } from 'react-redux';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { DetailsItem } from '../Details/DetailsItem';
import { DetailsTitle } from '../Details/DetailsTitle';

const CategoriesList = withCollapse(CategoryList);

export const List = ({userInfo}) => (
  <Fragment>
    <CategoriesList getId={({title}) => title}>
      <CategoryApiCard
        title="Kundeunivers"
        fetchData={() => Api.get(`/mine-data/category/kundeunivers/${userInfo.userInfo.UID}`)}
        render={(data) => (
           <Fragment>
             <DetailsTitle>Personal data</DetailsTitle>
             <DetailsItem value={data.name}>name</DetailsItem>
             <DetailsItem value={data.mail}>email</DetailsItem>
             <DetailsItem value={data.address}>address</DetailsItem>
             <DetailsItem value={data.zipcode}>zip code</DetailsItem>
             <DetailsItem value={data.city}>city</DetailsItem>
             <DetailsItem value={data.phone}>phone</DetailsItem>

             <DetailsTitle>Orders</DetailsTitle>
             {data.orders.map(order => order.items.map(item => (
               <Fragment key={item.sap_order_id}>
                 <DetailsItem className="mt-4" value={item.product_family}>product</DetailsItem>
                 <DetailsItem value={item.delicery_address}>delivery address</DetailsItem>
                 <DetailsItem value={item.subscription_type}>subscription type</DetailsItem>
                 <DetailsItem value={item.status}>status</DetailsItem>
                 <DetailsItem value={item.expiration_date}>expiration date</DetailsItem>
                 <DetailsItem value={item.billing_frequency}>billing frequency</DetailsItem>
               </Fragment>
             )))}
           </Fragment>
         )}/>
      <CategoryApiCard title="MDB"
                       fetchData={() => Api.get(`/mine-data/category/mdb/${userInfo.userInfo.profile.email}`)}
                       render={(data) => {

                       }}/>
    </CategoriesList>
  </Fragment>
);

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const CategoryApiList = connect(mapStateToProps)(List);