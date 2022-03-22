import React, { useState, useEffect, useRef, useCallback } from 'react';

import AdvertisingAnalyzePage from '../../../advertising-analyze/index';

const MiniMap: React.FC<any> = (props: any) => {
  return <AdvertisingAnalyzePage type="read" id={123} {...props} />;
};

export default MiniMap;
