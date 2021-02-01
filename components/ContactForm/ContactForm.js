import React from 'react'
import {MDBContainer, MDBRow} from "mdbreact";
import styles from './contactform.module.css'
const contactform = ()=>{
    return(
        <MDBContainer style={{maxWidth:'100%',backgroundColor: 'rgba(156, 180, 247, 0.4)'}}>
            <MDBRow>
                <div className="col-12 col-md-6 col-xl-4 mx-auto">
                    <div className={styles.hpContactBody}>
                        <h2 className={`${styles.hpContactHead} text-uppercase text-center`}>have some questions?</h2>
                        <form>
                            <div className="form-group">
                                <input type="text" className={`${styles.hpContactFormControl} form-control`} placeholder="First Name"/>
                            </div>
                            <div className="form-group">
                                <input type="text" className={`${styles.hpContactFormControl} form-control`} placeholder="Last Name"/>
                            </div>
                            <div className="form-group">
                                <input type="email" className={`${styles.hpContactFormControl} form-control`} placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <textarea className={`${styles.hpContactFormControlQ} form-control text-area`} placeholder="Your Question"></textarea>
                            </div>
                            <button type="submit" className={`${styles.hpContactSubmitBtn} btn btn-submit text-uppercase`}>send message</button>
                        </form>
                    </div>
                </div>
            </MDBRow>
        </MDBContainer>
    );
};
export default contactform;
