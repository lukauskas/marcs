import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import './styles/privacy.css'
import MatomoPageView from "../matomo/MatomoPageView";
import MatomoOptoutForm from "../matomo/MatomoOptoutForm";
import LicenseStatement from "../info/LicenseStatement";

export default class LegalNotice extends Component {
    render() {

        return (
            <>
                <MatomoPageView title="Privacy Policy" />
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            Legal Notice
                        </h1>
                        <nav>
                        <ul className="nav flex-column">
                            <li className="nav-item"><a href="#publisher">Publisher</a></li>
                            <li className="nav-item"><a href="#representatives">Representatives</a></li>
                            <li className="nav-item"><a href="#contact">Contact</a></li>
                            <li className="nav-item"><a href="#register-entry">Register entry</a></li>
                            <li className="nav-item"><a href="#vat-id">VAT ID</a></li>
                            <li className="nav-item"><a href="#responsible-for-content"> Responsible for the content according to Section 55 Abs. 2 RStV</a></li>
                            <li className="nav-item"><a href="#disclaimer">Disclaimer of liability</a></li>
                            <li className="nav-item"><a href="#copyright">Copyright</a></li>
                        </ul>
                        </nav>


                    </Container>
                </Jumbotron>
                <Container className="pb-5" id="privacy-policy">

                    <h1>
                        Legal Notice
                    </h1>

                    <p>Information according to § 5 TMG</p>

                    <h2>
                        <a name="publisher"/>
                        Publisher
                    </h2>

                    <address>
                        Helmholtz Zentrum München<br />
                        Deutsches Forschungszentrum für Gesundheit und Umwelt (GmbH)<br />
                        Ingolstädter Landstraße 1<br />
                        D-85764 Neuherberg<br />
                        Germany<br />
                    </address>

                    <h2>
                        <a name="representatives"/>
                        Representatives
                    </h2>

                    <p>
                        Board of Directors: Prof. Dr. med. Dr. h.c. Matthias H. Tschöp
                    </p>

                    <h2>
                        <a name="contact"/>
                        Contact:
                    </h2>

                    <address>
                        Phone: +49 89 3187-0<br/>
                        Internet: <a href="https://www.helmholtz-munich.de">www.helmholtz-munich.de</a><br/>
                        email: <a href="mailto:info@helmholtz-munich.de">info@helmholtz-munich.de</a><br/>
                    </address>

                     <h2>
                        <a name="register-entry"/>
                        Register entry:
                     </h2>

                     <p>
                         Entry in the registry court: Amtsgericht München<br/>
                         Registration number: HRB 6466
                     </p>

                    <h2>
                        <a name="vat-id"/>
                        VAT-ID:
                    </h2>
                    <p>
                        Value added tax identification number according to Section 27a Umsatzsteuergesetz:
                        DE 129521671
                    </p>

                    <h2>
                        <a name="responsible-for-content"/>
                        Responsible for the content according to Section 18 MStV
                    </h2>

                    <address>
                        Till Bartke<br />
                        Helmholtz Zentrum München<br />
                        Deutsches Forschungszentrum für Gesundheit und Umwelt (GmbH)<br />
                        Institute of Functional Epigenetics (IFE)<br />
                        Ingolstädter Landstraße 1<br />
                        D-85764 Neuherberg<br />
                    </address>

                    <h2>
                        <a name="disclaimer" />Disclaimer of liability:
                    </h2>

                    <h3>
                        Liability for contents:
                    </h3>

                    <p>
                        The contents of our pages were created with the greatest care. However, we cannot assume any liability for the correctness, completeness and topicality of the contents. As a service provider, we are responsible for our own content on these pages in accordance with Section 7(1) TMG (German Telemedia Act) under general law. According to Section 8-10 TMG we are not obliged to monitor transmitted or stored information from third parties or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this respect is only possible from the time of knowledge of a concrete infringement. If we become aware of any such violations, we will remove the content in question immediately.
                    </p>

                    <h3>
                        Liability for links
                    </h3>

                    <p>
                        Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore we cannot assume any liability for these external contents. The respective provider or operator of the sites is always responsible for the contents of the linked sites. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not identified at the time of linking. However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately.
                    </p>

                    <h2><a name="copyright"/>Copyright</h2>

                    <LicenseStatement/>

                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `Legal Notice — MARCS`;
    }
}
