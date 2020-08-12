import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { CompactPicker } from 'react-color';
import { colorIsLight } from 'components/common/colors';
import Card from 'react-bootstrap/Card';

const DEFAULT_COLOR = '#666666';

export default class ProteinColorSelector extends PureComponent {
    getColor = (key) => {
        const { colors } = this.props;

        const color = colors[key];
        // This may happen before we manage to detect props update.
        if (color === undefined) {
            return DEFAULT_COLOR;
        }

        return color;
    };


   colorPickerPopover = (key) => {
       const title = `Select colour for ${key}`;
       const color = this.getColor(key);

       const { onColorChange } = this.props;

       return (
           <Popover title={title}>
               <CompactPicker
                   color={color}
                   onChangeComplete={c => onColorChange(key, c.hex)}
               />
           </Popover>
       );
   };


   render() {
       const { selectedProteins } = this.props;
       const colorList = selectedProteins.map((x) => {
           const currentColor = this.getColor(x);

           return (
               <li className="list-inline-item" key={x}>
                   <OverlayTrigger trigger="click" placement="bottom" overlay={this.colorPickerPopover(x)} rootClose>
                       <div
                           className="badge"
                           style={{
                               backgroundColor: currentColor,
                               cursor: 'pointer',
                               color: colorIsLight(currentColor) ? 'black' : 'white',
                           }}
                       >
                           {x}
                       </div>
                   </OverlayTrigger>
               </li>
           );
       });

       return (
           <Card className="mb-3">
               <Card.Header>
                   Palette
               </Card.Header>
               <Card.Body>
                   <ol className="list-inline">
                       { colorList }
                   </ol>
                   <span className="text-muted">Click on the protein name to change colour</span>
               </Card.Body>
           </Card>
       );
   }
}

ProteinColorSelector.propTypes = {
    selectedProteins: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.objectOf(PropTypes.string).isRequired,
    onColorChange: PropTypes.func,
};

ProteinColorSelector.defaultProps = {
    onColorChange() { },
};
