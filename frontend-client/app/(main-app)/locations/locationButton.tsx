import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function LocationButton() {
    return (
        <DropdownButton id="dropdown-button" className = "location-button" title="Choose your location" variant = "dark">
          <Dropdown.Item href="/locations/com3-b1"> COM3 Basement Level 1 </Dropdown.Item>
          <Dropdown.Item href="/locations/com3-l1"> COM3 Level 1 </Dropdown.Item>
          <Dropdown.Item href="/locations/com3-l2"> COM3 Level 2 </Dropdown.Item>
        </DropdownButton>
    );
}

export default LocationButton;