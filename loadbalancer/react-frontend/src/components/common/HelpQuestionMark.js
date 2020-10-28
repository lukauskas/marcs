import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { useMatomo } from '@datapunt/matomo-tracker-react';


export default function HelpQuestionMark(props) {
    const { title, children } = props;
    const { trackEvent } = useMatomo();

    const handleToggle = (show) => {
        if (show) {
            trackEvent({
                category: 'help-text',
                action: 'open-help-bubble',
                name: title,
            });
        }
    };

    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content>
                {children}
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger trigger={['hover', 'focus']} placement="auto" onToggle={handleToggle} overlay={popover}>
            <Button as="a" variant="link" size="sm" className="pb-0 pt-0">
                <FontAwesomeIcon icon={faQuestionCircle} />
            </Button>
        </OverlayTrigger>
    );
}

HelpQuestionMark.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};

HelpQuestionMark.defaultProps = {
    title: '',
};
