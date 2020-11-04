import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import './styles/privacy.css'
import MatomoPageView from "../matomo/MatomoPageView";
import MatomoOptoutForm from "../matomo/MatomoOptoutForm";

export default class PrivacyPolicy extends Component {
    render() {

        return (
            <>
                <MatomoPageView title="Privacy Policy" />
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            Privacy Policy
                        </h1>
                        <nav>
                        <ul className="nav flex-column">
                            <li className="nav-item"><a href="#section-1">I. Name and address of the controller</a></li>
                            <li className="nav-item"><a href="#section-2">II. Name and address of the Data Protection Officer</a></li>
                            <li className="nav-item"><a href="#section-3">III. General information on data processing</a></li>
                            <li className="nav-item"><a href="#section-4">IV. Provision of the website and creation of log files</a></li>
                            <li className="nav-item"><a href="#section-5">V. Use of Cookies</a></li>
                            <li className="nav-item"><a href="#section-6">VI. Web Analytics by Matomo (formerly PIWIK)</a></li>
                            <li className="nav-item"><a href="#section-7">VII. Transfer of Personal Data to Third Parties</a></li>
                            <li className="nav-item"><a href="#section-8">VIII. Email contact</a></li>
                            <li className="nav-item"><a href="#section-9">IX. Rights of the data subject</a></li>
                        </ul>
                        </nav>


                    </Container>
                </Jumbotron>
                <Container className="pb-5" id="privacy-policy">

                    <h1>
                        Privacy Policy
                    </h1>

                    {/*Paragraph 1 */}
                    <h2><a name="section-1" />I. Name and address of the controller</h2>
                    <p>
                        In the sense of the General Data Protection Regulation (GDPR) and other national data protection laws in the member states as well as other provisions of data protection law, the controller is:
                    </p>
                    <address>
                        Helmholtz Zentrum München<br />
                        Deutsches Forschungszentrum für Gesundheit und Umwelt (GmbH)<br />
                        Ingolstädter Landstr. 1<br />
                        D-85764 Neuherberg<br />
                        Germany<br />
                        Tel.: + 49 89 3187 - 0<br />
                        email: <a href="mailto:info@helmholtz-muenchen.de">info@helmholtz-muenchen.de</a><br />
                        Website: <a href="http://www.helmholtz-muenchen.de">http://www.helmholtz-muenchen.de</a><br />
                    </address>

                    {/*Paragraph 2*/}
                    <h2><a name="section-2" />II. Name and address of the Data Protection Officer</h2>
                    <p>
                    You can contact the Data Protection Officer of the controller as follows:
                    </p>

                    <address>
                    Data Protection Officer of the Helmholtz Zentrums München<br />
                    Werner Bergheim<br />
                    Ingolstädter Landstr. 1<br />
                    D-85764 Neuherberg<br />
                    Germany<br />
                    email: <a href="mailto:datenschutz@helmholtz-muenchen.de">datenschutz@helmholtz-muenchen.de</a><br/>
                    </address>

                    {/*Paragraph 3*/}
                    <h2><a name="section-3" />III. General information on data processing</h2>


                    <h3>1. Scope of the processing of personal data</h3>
                    <p>
                        We fundamentally process the personal data of our users only to the extent required to provide a functioning website as well as our contents and services. As a rule, our users' personal data are processed only with the consent of the user. An exception applies in those cases in which it is not possible to obtain prior consent due to factual reasons and statutory provisions permit the processing of the data.
                    </p>
                    <h3>2. The legal basis for the processing of personal data</h3>
                    <p>
                        As far as we obtain consent from the data subject for personal data processing procedures, Article 6(1)(a) of the EU General Data Protection Regulation (GDPR) serves as the legal basis.
                    </p>
                    <p>
                        For the processing of personal data that is necessary for the performance of a contract to which the data subject is party, Article 6(1)(b) GDPR serves as the legal basis. This also applies to processing procedures that are necessary in order to take steps prior to entering into a contract.
                    </p>
                    <p>
                        As far as processing of personal data is necessary for compliance with a legal obligation to which our company is subject, Article 6(1)(c) GDPR serves as the legal basis.
                    </p>
                    <p>
                        In the event that processing of personal data is necessary in order to protect the vital interests of the data subject or of another natural person, Article 6(1)(d) GDPR serves as the legal basis.
                    </p>
                    <p>
                        If the processing is necessary to safeguard the legitimate interests of our company or of a third party, and the interests, fundamental rights and freedoms of the data subject do not override the first-mentioned interests, Article 6(1)(f) GDPR serves as the legal basis for the processing.
                    </p>
                    <h3>3. Data erasure and storage period</h3>
                    <p>
                        The personal data of the data subject are erased or blocked as soon as the purpose of the storage no longer applies. Data can additionally be stored if this was intended by the European or national lawmakers in EU regulations, laws or other stipulations to which the controller is subject and is foreseeable. Data are also blocked or erased when a storage period prescribed by the standards mentioned expires, unless there is a necessity for further storage of the data in order to conclude or fulfil a contract.
                    </p>

                    {/*Paragraph 4*/}
                    <h2><a name="section-4" />IV. Provision of the website and creation of log files</h2>
                    <h3>1. Description and scope of the data processing</h3>
                    <p>
                        Each time our website is accessed, our system automatically records data and information regarding the computer system of the accessing computer.
                    </p>
                    <p>
                        The following data are collected in this case:
                    </p>
                    <ul>
                        <li>Information on the browser type and the version in use</li>
                        <li>The user's operating system</li>
                        <li>The user's pseudonymized IP address</li>
                        <li>Date and time of day of the access</li>
                        <li>Websites from which the user's system reaches our website</li>
                        <li>Websites that the user's system accesses through our website</li>
                    </ul>
                    <p>
                        The data are likewise stored in our system's log files. These data are not stored together with other personal data of the user.
                    </p>
                    <h3>2. Legal basis for the data processing</h3>
                    <p>
                        The legal basis for the temporary storage of the data and the log files is Article 6(1)(f) GDPR.
                    </p>
                    <h3>3. Purpose of the data processing</h3>
                    <p>
                        The system will temporarily store the IP address as is necessary, in order to allow the website to be delivered to the computer of the user. This requires the user’s IP address to be stored for the duration of the session.
                    </p>
                    <p>
                        The storage of log files takes place, in order to ensure the functional capability of the website. We additionally use the data to optimize the website and to ensure the safety and security of our information technology systems. Data is not evaluated for marketing purposes in this connection.
                    </p>
                    <p>
                        For these purposes, our legitimate interest in data processing is also in accordance with Article 6(1)(f) GDPR.
                    </p>
                    <h3>4. Storage period</h3>
                    <p>
                        The data are deleted as soon as they are no longer necessary to achieve the purpose for which they were collected. When data is collected in order to enable the functioning of the website, the data will be deleted as soon as the session has ended.
                    </p>
                    <p>
                        In the case of data storage in log files, this is the case after no more than seven days. Certain storage beyond this period is possible. In this case, the IP addresses of the users are deleted or masked so that it is no longer possible to reference the accessing client.
                    </p>
                    <h3>5. Possibility of objection and disposal</h3>
                    <p>
                        The recording of data for the provision of the website and storage of the data in log files is vital to the operation of the internet website. The user consequently has no possibility to object.
                    </p>

                    {/*Paragraph 5*/}
                    <h2><a name="section-5" />V. Use of Cookies</h2>

                    <p>
                        Our website does not use cookies for general operation of the website.
                    </p>
                    <p>
                        If a user chooses to opt-out of web analytics by Matomo, the website will place a cookie to remember this choice as described in section VI. Web Analytics by Matomo (formerly PIWIK).
                    </p>

                    {/*Paragraph 6*/}
                    <h2><a name="section-6" />VI. Web Analytics by Matomo (formerly PIWIK)</h2>

                    <h3>1. Scope of processing of personal data</h3>
                    <p>
                        We use the open source software tool Matomo (formerly PIWIK) on our website to analyze the surfing behavior of our users. If individual pages of our website are called up, the following data is stored:
                    </p>
                    <ul>
                        <li>Two bytes of the IP address of the calling system of the user</li>
                        <li>The website accessed and the time of access</li>
                        <li>The website from which the user came to the accessed website (referrer)</li>
                        <li>The subpages that are accessed from the accessed website</li>
                        <li>The information about website usage during the user’s visit, including the timestamps and frequency of the events. This includes the website controls that the user interacts with during their visit, visualisations they view and the visualisation settings used including the complete search terms.</li>
                        <li>The errors that occurred during user’s visit and their timestamp</li>
                        <li>The time spent on the website</li>
                        <li>The frequency with which the website is accessed</li>
                        <li>Which browser is used with which plug-ins, which operating system and which screen resolution</li>
                    </ul>
                    <p>
                        The software runs exclusively on the servers of our website. The user's personal data is only stored there. The data will not be passed on to third parties.
                    </p>
                    <p>
                        The software is set so that the IP addresses are not saved in full, but 2 bytes of the IP address are masked (e.g. 192.168.xxx.xxx). In this way, it is no longer possible to assign the shortened IP address to the calling computer.
                    </p>
                    <p>
                        We have disabled the use of cookies by the Matomo software.
                    </p>
                    <p>
                        In addition since version 3.13.6, Matomo has been using the so-called "fingerprinting" method, which is used for tracking without cookies, in an anonymized manner. A random value for this fingerprint is generated every 24 hours, thus preventing returning visitors to the website from being recognized and creating a personal user profile.
                    </p>
                    <h3>2. Legal basis for processing personal data</h3>
                    <p>
                        The legal basis for processing users' personal data is Art. 6 Para. 1 lit. f GDPR.
                    </p>
                    <h3>3. Purpose of data processing</h3>
                    <p>
                        The processing of the personal data of the users enables us to analyze the surfing behavior of our users. By evaluating the data obtained, we are able to compile information about the use of the individual components of our website. This helps us to continuously improve our website and its user-friendliness. For these purposes, our legitimate interest lies in the processing of the data according to Art. 6 Para. 1 lit. f GDPR. By anonymizing the IP address, the interests of users in protecting their personal data are adequately taken into account.
                    </p>
                    <h3>4. Duration of storage</h3>
                    <p>
                        The data will be deleted as soon as they are no longer required for the above-mentioned purposes.
                    </p>
                    <h3>5. Opposition and removal option</h3>
                    <p>
                        You can activate the "Do-not-Track" setting in your browser. Our Matomo system is configured in such a way that it respects this setting.
                    </p>
                    <p>
                        We offer our users the option of opting out of the analysis process on our website. To do this, you have to follow the link below. In this way, a cookie is set on your system, which signals our system not to save the user's data. The opt-out cookie is valid for two years. If the user deletes the corresponding cookie from his own system in the meantime, he must set the opt-out cookie again.
                    </p>
                    <p>
                        Note that in order to provide the opt-out form below, Matomo software sets an additional temporary cookie <em>MATOMO_SESSID</em>. This cookie is used only for security purposes as it prevents misuse of the form. You can find more information <a href="https://matomo.org/faq/general/faq_146/">here</a>.
                    </p>
                    <MatomoOptoutForm/>
                    <p>
                        You can find more information about the privacy settings of the Matomo software under the following link: <a href="https://matomo.org/docs/privacy">matomo.org/docs/privacy</a>
                    </p>

                    {/*Paragraph 7*/}
                    <h2><a name="section-7" />VII. Transfer of Personal Data to Third Parties</h2>
                    <p>
                        We will only transfer your personal data to third parties if you have given your express consent in accordance with Art. 6(1) (a) GDPR, if this is necessary in accordance with Art. 6(1) (b) GDPR for the performance of a contract with you or in the event that there is a legal obligation to do so in accordance with Art. 6(1) (c) GDPR.
                    </p>

                    {/*Paragraph 8*/}
                    <h2><a name="section-8" />VIII. Email contact</h2>
                    <h3>1. Description and scope of data processing</h3>
                    <p>
                        You can contact us using the email address provided on the respective website. In this case, the user's personal data transmitted with the email will be saved.
                    </p>
                    <p>
                        In this context, the data will not be passed on to third parties, unless explicit reference is made to this in the context of the consent. The data will only be used to process the conversation.
                    </p>
                    <h3>2. Legal basis for data processing</h3>
                    <p>
                        The legal basis for the processing of the data that is transmitted in the course of sending an email is Art. 6 Para. 1 lit. f GDPR. If the aim of the email contact is to conclude a contract, the additional legal basis for the processing is Art. 6 Para. 1 lit. b GDPR.
                    </p>
                    <h3>3. Purpose of data processing</h3>
                    <p>
                        If you contact us by email, there is the necessary legitimate interest in processing the data.
                    </p>
                    <h3>4. Duration of storage</h3>
                    <p>
                        The data will be deleted as soon as they are no longer required to achieve the purpose for which they were collected. For the personal data that were sent by email, this is the case when the respective conversation with the user has ended. The conversation is ended when it can be inferred from the circumstances that the matter in question has been finally clarified.
                    </p>
                    <h3>5. Opposition and removal option</h3>
                    <p>
                        The user has the option at any time to revoke their consent to the processing of personal data. If the user contacts us by email, they can object to the storage of their personal data at any time. In such a case, the conversation cannot be continued.
                    </p>
                    <p>
                        In this case, all personal data stored in the course of contacting us will be deleted.
                    </p>

                    {/*Paragraph 9*/}
                    <h2><a name="section-9" />IX. Rights of the data subject</h2>
                    If your personal data is processed, you are the subject in the sense of the GDPR and you have the following rights with respect to the controller:
                    <h3>1. Right to information</h3>
                    <p>
                        You can request confirmation from the controller as to whether or not we have processed personal data that concern you.
                    </p>
                    <p>
                        In the event there is such processing, you can request disclosure of the following information by the controller:
                    </p>
                    <ul>
                        <li>the purposes for which the personal data are being processed;</li>
                        <li>the categories of personal data that are being processed;</li>
                        <li>the recipient or the categories of recipients to whom the personal data concerning you was disclosed or is still being disclosed;</li>
                        <li>the planned storage period of the personal data concerning you or, if it is not possible to make concrete statements in this regard, criteria for determining the storage period;</li>
                        <li>the existence of a right to the rectification or erasure of the personal data concerning you, of a right to restriction of the processing by the controller or of a right to object to this processing;</li>
                        <li>the existence of a right to lodge a complaint with a supervisory authority;</li>
                        <li>all available information on the origin of the data if the personal data were not collected from the data subject;</li>
                        <li>the existence of automated decision-making, including profiling, referred to in Article 22(1) and (4) GDPR and, at least in these cases, meaningful information about the logic involved, as well as the significance and the envisaged consequences of such processing for the data subject.</li>
                    </ul>
                    <p>
                        You have the right to request disclosure of whether or not the personal data concerning you are transferred to a third country or to an international organisation. In this connection, you can request to be informed of the appropriate safeguards pursuant to Article 46 GDPR relating to the transfer.
                    </p>
                    <h3>2. Right to rectification</h3>
                    <p>
                        You have a right to rectification and/or completion with respect to the controller as far as the processed personal data concerning you are incorrect or incomplete. The controller must carry out the rectification without undue delay.
                    </p>
                    <h3>3. Right to restriction of processing</h3>
                    <p>
                        You can request the restriction of the processing of the personal data concerning you under the following conditions:
                    </p>
                    <ul>
                        <li>If you contest the accuracy of the personal data concerning you for a period that enables the controller to verify the accuracy of the personal data;</li>
                        <li>the processing is unlawful and you oppose the erasure of the personal data and request the restriction of the use of the personal data instead;</li>
                        <li>the controller no longer needs the personal data for the purposes of the processing, but you require them for the establishment, exercise or defence of legal claims, or</li>
                        <li>if you have objected to processing pursuant to Article 21(1) GDPR pending the verification of whether the legitimate grounds of the controller override your grounds.</li>
                    </ul>
                    <p>
                        If processing of the personal data concerning you has been restricted, such data will, with the exception of storage, only be processed with your consent or for the establishment, exercise or defence of legal claims or for the protection of the rights of another natural or legal person or for reasons of important public interest of the Union or of a Member State.
                    </p>
                    <p>
                        If the processing has been restricted in accordance with the requirements given above, you will be informed by the controller before the restriction is lifted.
                    </p>
                    <h3>
                        4. Right to erasure
                    </h3>
                    <h4>
                        4.1 Erasure obligation
                    </h4>
                    <p>
                        You can request that the controller erase the personal data concerning you without undue delay. The controller has the obligation to erase the data without undue delay where one of the following grounds apply:
                    </p>
                    <ul>
                        <li>The personal data concerning you are no longer necessary in relation to the purposes for which they were collected or otherwise processed.</li>
                        <li>You withdraw your consent on which the processing is based according to Article 6(1) (a), or Article 9(2) (a) GDPR, and where there is no other legal ground for the processing.</li>
                        <li>You object to the processing pursuant to Article 21(1) GDPR and there are no overriding legitimate grounds for the processing, or you object to the processing pursuant to Article 21(2) GDPR. </li>
                        <li>The personal data concerning you has been unlawfully processed. </li>
                        <li>The personal data concerning you have to be erased for compliance with a legal obligation in Union or Member State law to which the controller is subject.</li>
                        <li>The personal data concerning you has been collected in relation to the offer of information society services referred to in Article 8(1) GDPR.</li>
                    </ul>
                    <h4>4.2 Information to third parties</h4>
                    <p>
                        Where the controller has made the personal data concerning you public and is obliged pursuant to Article 17 (1) GDPR to erase the personal data, the controller, taking account of available technology and the cost of implementation, will take reasonable steps, including technical measures, to inform controllers that are processing the personal data that you, as the data subject, have requested the erasure by such controllers of any links to these personal data or of copies or replications of these personal data.
                    </p>
                    <h4>4.3 Exceptions</h4>
                    <p>
                        There is no right to erasure to the extent that the processing is necessary:
                    </p>
                    <ul>
                        <li>For exercising the right of freedom of expression and information;</li>
                        <li>for compliance with a legal obligation which requires processing by Union or Member State law to which the controller is subject or for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;</li>
                        <li>for reasons of public interest in the area of public health in accordance with Article 9(2) (h) and (i) as well as Article 9(3) GDPR; </li>
                        <li>for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) GDPR in so far as the right referred to in section a) is likely to render impossible or seriously impair the achievement of the objectives of that processing, or</li>
                        <li>for the establishment, exercise or defence of legal claims.</li>
                    </ul>

                    <h3>5. Right to be informed</h3>
                    <p>
                        If you have established the right to rectification, erasure or restriction of the processing with respect to the controller, the controller is obligated to communicate this rectification or erasure of data or restriction of processing to each recipient to whom the personal data has been disclosed, unless this proves impossible or involves disproportionate effort.
                    </p>
                    <p>
                        You have the right to be informed by the controller about these recipients.
                    </p>

                    <h3>6. Right to data portability</h3>
                    <p>
                        You have the right to receive the personal data concerning you, which you have provided to the controller, in a structured, commonly used and machine-readable format. You furthermore have the right to transmit the data to another controller without hindrance from the controller to which the personal data have been provided, as far as
                    </p>
                    <ul>
                        <li>the processing is based on consent pursuant to Article 6(1) (a) GDPR or Article 9(2) (a) or on a contract pursuant to Article 6(1) (b) GDPR and</li>
                        <li>the processing is carried out by automated means.</li>
                    </ul>
                    <p>
                        In exercising this right, you furthermore have the right to have the personal data concerning you transmitted directly from one controller to another, where technically feasible. This is not permitted to adversely affect the freedoms and rights of others.
                    </p>
                    <p>
                        The right to data portability does not apply to processing of personal data that is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller.
                    </p>

                    <h3>7. Right to object</h3>
                    <p>
                        You have the right to object to the processing of your personal data, at any time, based on grounds relating to your particular situation or Article 6(1) (e) or (f) GDPR, including profiling based on those provisions.
                    </p>
                    <p>
                        The controller will no longer process the personal data concerning you unless the controller demonstrates compelling legitimate grounds for the processing which override your interests, rights and freedoms or if the processing serves the establishment, exercise or defence of legal claims.
                    </p>
                    <p>
                        Where personal data concerning you are processed for direct marketing purposes, you have the right to object at any time to processing of the personal data concerning you for such marketing, which includes profiling to the extent that it is related to such direct marketing.
                    </p>
                    <p>
                        If you object to processing for direct marketing purposes, the personal data concerning you will no longer be processed for such purposes.
                    </p>
                    <p>
                        In the context of the use of information society services, and notwithstanding Directive 2002/58/EC, you may exercise your right to object by automated means using technical specifications.
                    </p>

                    <h3>8. Right to withdraw the data protection declaration of consent</h3>
                    <p>
                        You have the right to withdraw your declaration of consent at any time. Withdrawing your consent does not affect the lawfulness of prior processing with consent before its withdrawal.
                    </p>

                    <h3>9. Automated individual decision-making, including profiling</h3>
                    <p>
                        You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you. This does not apply if the decision
                    </p>
                    <ul>
                        <li>(1) is necessary for entering into, or performance of, a contract between you and the controller,</li>
                        <li>(2) is authorised by Union or Member State law to which the controller is subject and which also lays down suitable measures to safeguard your rights and freedoms and legitimate interests, or</li>
                        <li>(3) takes place with your explicit consent.</li>
                    </ul>
                    <p>
                        However, these decisions are not permitted to be based on special categories of personal data referred to in Article 9(1) GDPR unless Article 9(2) (a) and (g) GDPR applies and suitable measures to safeguard your rights and freedoms and legitimate interests are in place.
                    </p>
                    <p>
                        In the cases referred to in points (1) and (3), the data controller implements suitable measures to safeguard your rights and freedoms and legitimate interests, at least the right to obtain human intervention on the part of the controller, to express your own point of view and to contest the decision.
                    </p>

                    <h3>10. Right to lodge a complaint with a supervisory authority</h3>
                    <p>
                        Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your residence, place of work or place of the alleged infringement if you consider that the processing of personal data relating to you violates the GDPR.
                    </p>
                    <p>
                        The supervisory authority with which the complaint has been lodged will inform the complainant on the progress and the outcome of the complaint including the possibility of a judicial remedy pursuant to Article 78 GDPR.
                    </p>
                    <p>
                        The competent supervisory authority for the Helmholtz Zentrum München is the:
                    </p>
                    <address>
                        Bundesbeauftragter für den Datenschutz und die Informationsfreiheit (BfDI)<br/>
                        &lt;Federal Commissioner for Data Protection and Freedom of Information&gt; Husarenstr. 30<br/>
                        53117 Bonn<br/>
                        Germany<br/>
                        Tel.: +49 228 997799-0<br/>
                        email: <a href="mailto:poststelle@bfdi.bund.de">poststelle@bfdi.bund.de</a>.<br/>
                    </address>

                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `Privacy Policy — MARCS`;
    }
}
