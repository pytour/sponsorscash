import React from 'react';
import { QRCode } from 'react-qr-svg';
import styles from './cashid.module.css'
import axios from 'axios'
import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig();

class CashId extends React.Component {
    constructor(props) {
        super(props);
        this.state = { web4bch: null, cashIDuri: '', badger: true };
    }
    componentDidMount() {
        if (typeof window.web4bch === 'undefined') {
            this.setState({
                badger: false
            });
        } else {
            web4bch = new Web4Bch(web4bch.currentProvider);
            // if (web4bch.bch && web4bch.bch.defaultAccount === undefined) {
            //     alert('please unlock your badgerwallet');
            // }

            this.generateURI();

            this.setState({
                web4bch: web4bch
            });
        }
    }

    generateURI() {
        axios.post(publicRuntimeConfig.APP_URL+'/users/cashid/request',this.props)
            .then(res=> {
                if(res) {
                    this.setState({cashIDuri: res.data.uri})
                }
            })
            .catch(err=>console.log(err));
    }

    badgerSign(cashIDRequest) {
        const { callback } = this.props;
        let web4bch = this.state.web4bch;
        if (typeof web4bch === undefined) {
            window.open('https://badger.bitcoin.com/', '_blank').focus();
        } else {
            web4bch.bch.sign(web4bch.bch.defaultAccount, cashIDRequest, function(err, res) {

                if (callback !== undefined) {
                    callback(web4bch.bch.defaultAccount,res);
                }

                if (err) return;
            });
        }
    }
    render() {
        let { badger, cashIDuri } = this.state;
        const { qr, color } = this.props;
        return (
            <div>
                {badger ? (
                    <div style={{display:'block'}}>
                        <button
                            type="button"
                            className={`${styles.badgerButton} btn`}
                            onClick={() => {
                                this.badgerSign(cashIDuri);
                            }}
                        >
                            CASHID
                        </button>

                        <br />
                        <br />
                        {qr && (
                            <div>
                                or scan with CashID manager
                                <br />
                                <br />
                                {cashIDuri && (
                                    <QRCode value={cashIDuri} style={{ width: 200 }} />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        you must have&nbsp;
                        <a
                            href='https://badgerwallet.cash/#/install'
                            rel='nofollow'
                            target='_blank'
                        >
                            Badger Wallet
                        </a>
                        &nbsp;installed to login with CashID
                    </div>
                )}
            </div>
        );
    }
}
export default CashId;
