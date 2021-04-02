import Warning from '../../utils/warning';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as PropTypes from 'prop-types';
import React from 'react';

export default function DonationModal(props) {
    return <>{props.modal ? (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full  my-4 mx-auto max-w-3xl">
                    {/*content*/}
                    <div
                        className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div
                            className="flex items-center justify-center p-3 border-b border-solid border-gray-300 rounded-t">
                            <h4 className="text-2xl text-center font-semibold">
                                {props.receivingAddress ? 'BCH Cash Address' : 'Donate'}
                            </h4>
                            <button
                                onClick={props.onClick}
                                className="p-1 ml-auto bg-transparent border-0 text-red  float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                                        <span
                                            className="bg-transparent text-black font-black  h-6 w-6 text-3xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                            </button>
                        </div>
                        {/*body*/}
                        {!props.receivingAddress && (
                            <form onSubmit={props.formik.handleSubmit}>
                                <div className=" p-6  flex-auto">
                                    <div className="flex space-between items-baseline text-branding-color">
                                        <div className="mb-3 w-full">
                                            <p className="mb-3">Enter BCH Amount:</p>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                placeholder="Amount (BCH)"
                                                onChange={props.formik.handleChange}
                                                onBlur={props.formik.handleBlur}
                                                value={props.formik.values.amount}
                                                className="mb-3 w-full  h-10 p-3 text-outline-color placeholder-placeholder
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                            />
                                            {props.formik.touched.amount &&
                                            props.formik.errors.amount ? (
                                                <Warning message={props.formik.errors.amount}/>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex  space-between items-baseline text-branding-color">
                                        <div className="mb-3 w-full">
                                            <p className="mb-3">Your Name</p>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                placeholder="Name"
                                                onChange={props.formik.handleChange}
                                                onBlur={props.formik.handleBlur}
                                                value={props.formik.values.name}
                                                className=" w-full  h-10 p-3 text-outline-color placeholder-placeholder
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                            />
                                            {props.formik.touched.name && props.formik.errors.name ? (
                                                <Warning message={props.formik.errors.name}/>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="mb-2 w-full">
                                        <p className="text-left pb-3 text-branding-color">
                                            Comment
                                        </p>
                                        <textarea
                                            name="comment"
                                            id="comment"
                                            placeholder="Comment"
                                            onChange={props.formik.handleChange}
                                            onBlur={props.formik.handleBlur}
                                            value={props.formik.values.comment}
                                            maxLength="300"
                                            className="px-3 pt-1.5 w-full
                                   rounded-md border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                        />
                                        {props.formik.touched.comment && props.formik.errors.comment ? (
                                            <Warning message={props.formik.errors.comment}/>
                                        ) : null}
                                    </div>
                                </div>
                                {/*footer*/}
                                <div
                                    className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                                    <button
                                        className="bg-branding-color mr-4 text-white active:bg-branding-color font-bold uppercase text-sm md:px-12 px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1"
                                        type="submit"
                                        style={{ transition: 'all .15s ease' }}>
                                        Get Address
                                    </button>
                                    <button
                                        className="text-white bg-red-400  font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        style={{ transition: 'all .15s ease' }}
                                        onClick={props.onClick1}>
                                        Close
                                    </button>
                                </div>
                            </form>
                        )}

                        {props.receivingAddress && (
                            <div>
                                <div className="p-6 flex-auto text-center">
                                    <div className=" md:my-8 items-center justify-items-center">
                                        <p className=" text-xl font-black px-4 pt-8 pb-6 text-site-theme">
                                            {' '}
                                            Please sentd BCH to this Cash Address:{' '}
                                        </p>

                                        <p className="mx-4 text-xl text-black font-black p-4 break-words">
                                            {props.receivingAddress}
                                        </p>

                                        {!props.props.projCashAddress &&
                                        <p className="py-6 mx-4 text-base font-medium text-red-500">
                                            Please note,this address is valid for 5
                                            minutes,try to send amount within this time
                                        </p>}
                                    </div>
                                </div>

                                <div
                                    className="flex items-center justify-center p-6  border-solid border-gray-300 rounded-b">
                                    <CopyToClipboard
                                        text={props.receivingAddress}
                                        onCopy={props.onCopy}>
                                        <button
                                            className="text-white  bg-branding-color  font-bold uppercase px-6 py-3 text-center text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            style={{ transition: 'all .15s ease' }}
                                            onClick={props.onClick2}>
                                            {props.copier ? 'Copier' : 'Click to Copy'}
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"/>
        </>
    ) : null}</>;
}

DonationModal.propTypes = {
    modal: PropTypes.any,
    receivingAddress: PropTypes.any,
    onClick: PropTypes.func,
    formik: PropTypes.shape({
        initialValues: PropTypes.shape({
            name: PropTypes.string,
            comment: PropTypes.string,
            amount: PropTypes.number
        }),
        initialErrors: PropTypes.func,
        initialTouched: PropTypes.func,
        initialStatus: PropTypes.any,
        handleBlur: PropTypes.func,
        handleChange: PropTypes.func,
        handleReset: PropTypes.func,
        handleSubmit: PropTypes.func,
        resetForm: PropTypes.func,
        setErrors: PropTypes.func,
        setFormikState: PropTypes.func,
        setFieldTouched: PropTypes.func,
        setFieldValue: PropTypes.func,
        setFieldError: PropTypes.func,
        setStatus: PropTypes.func,
        setSubmitting: PropTypes.func,
        setTouched: PropTypes.func,
        setValues: PropTypes.func,
        submitForm: PropTypes.func,
        validateForm: PropTypes.func,
        validateField: PropTypes.func,
        isValid: PropTypes.bool,
        dirty: PropTypes.bool,
        unregisterField: PropTypes.func,
        registerField: PropTypes.func,
        getFieldProps: PropTypes.func,
        getFieldMeta: PropTypes.func,
        getFieldHelpers: PropTypes.func,
        validateOnBlur: PropTypes.bool,
        validateOnChange: PropTypes.bool,
        validateOnMount: PropTypes.bool,
        values: PropTypes.shape({ name: PropTypes.string, comment: PropTypes.string, amount: PropTypes.number }),
        errors: PropTypes.any,
        touched: PropTypes.any,
        isSubmitting: PropTypes.bool,
        isValidating: PropTypes.bool,
        status: PropTypes.any,
        submitCount: PropTypes.number
    }),
    onClick1: PropTypes.func,
    props: PropTypes.any,
    onCopy: PropTypes.func,
    onClick2: PropTypes.func,
    copier: PropTypes.any
};
