import React, {useEffect, useState} from "react";
import { withRedux } from "../../lib/redux";
import Layout from "../../components/Layout/Layout";
import ProfileCard from '../../components/PA-ProfileCard/profileCard'
import Showmore from "../../components/UI/Showmore";
import SmallCard from '../../components/PA-SmallCard/smallCard'
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {useSelector} from "react-redux";
import Swal from "sweetalert2";
import Router, {useRouter} from "next/router";
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();
import axios from "axios";
const sponsorAccountPublic = () => {
    const [userData,setUserData] = useState({});
    const router = useRouter();
    useEffect(() => {

            axios.get(publicRuntimeConfig.APP_URL+'/users/getUserProfile/'+router.query.sponsorPublic).then(res=>{

                setUserData(res.data);
            })
                .catch(err=>console.log(err))

    }, []);
    return (
        <Layout>
            <ProfileCard userData={userData} showEditButton={false}/>
            <MDBContainer>
                <MDBRow>
                    <MDBCol size="12" >
                        <div className="d-flex justify-content-between align-items-baseline hp-wrapper">
                            <h2 className="d-inline-block hp-headText">My Donations</h2>
                        </div>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="../static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="art"
                        />
                    </MDBCol>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="art"
                        />
                    </MDBCol>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="art"
                        />
                    </MDBCol>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="art"
                        />
                    </MDBCol>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="art"
                        />
                    </MDBCol>
                    <MDBCol className="col-12 col-md-6 col-lg-4">
                        <SmallCard
                            imgSrc="static/images/campaigns/woman-wearing-animal-print-head-scarf-1038158.jpg"
                            tag="architecture"
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            {/* <Showmore/> */}
            <style jsx>{`
      .hp-wrapper{
       padding:1em;
      }
      .hp-headText{
        color:#737dc3;
        font-weight:400;
        font-size:2.3rem;
      }
      .hptoggle {
      border: 1px solid #7d73c3;
    border-radius: 30px;
    color: #7d73c3;
    font-size: 1.3rem;
    width: 12rem;
      }
    `}</style>
        </Layout>
    );
};

export default withRedux(sponsorAccountPublic);
