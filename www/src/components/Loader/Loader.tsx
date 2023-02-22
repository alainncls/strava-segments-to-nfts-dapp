import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loader.css';

interface IProps {
  loading: boolean;
}

const Loader = (props: IProps) => {
  const { loading } = props;

  return loading ? (
    <div className={'loading-overlay'}>
      <div className={'spinner'}>
        <Spinner animation={'grow'} role={'status'} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Loader;
