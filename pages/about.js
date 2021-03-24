import React from "react";
import Layout from "../components/Layout";
import {withRedux} from "../lib/redux";

const About = () => (
  <div>
    <Layout>
        <div>
            <div>
                A simple primary alert—check it out!
            </div>
        </div>
    </Layout>
  </div>
);

export default withRedux(About);
