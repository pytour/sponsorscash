import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const search = () => (

    <Link>
      <FontAwesomeIcon icon={faSearch} display="flex" />
    </Link>

);

export default search;
