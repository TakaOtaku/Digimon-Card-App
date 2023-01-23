import { ICard } from '../../../models';

import AA from './AAs.json';

import BT1 from './BT/BT1.json';
import BT10 from './BT/BT10.json';
import BT11 from './BT/BT11.json';
import BT12 from './BT/BT12.json';
import BT2 from './BT/BT2.json';
import BT3 from './BT/BT3.json';
import BT4 from './BT/BT4.json';
import BT5 from './BT/BT5.json';
import BT6 from './BT/BT6.json';
import BT7 from './BT/BT7.json';
import BT8 from './BT/BT8.json';
import BT9 from './BT/BT9.json';

import EX1 from './EX/EX1.json';
import EX2 from './EX/EX2.json';
import EX3 from './EX/EX3.json';
import EX4 from './EX/EX4.json';

import RB01 from './RB01.json';

import P from './P.json';

import ST1 from './ST/ST1.json';
import ST10 from './ST/ST10.json';
import ST12 from './ST/ST12.json';
import ST13 from './ST/ST13.json';
import ST14 from './ST/ST14.json';
import ST2 from './ST/ST2.json';
import ST3 from './ST/ST3.json';
import ST4 from './ST/ST4.json';
import ST5 from './ST/ST5.json';
import ST6 from './ST/ST6.json';
import ST7 from './ST/ST7.json';
import ST8 from './ST/ST8.json';
import ST9 from './ST/ST9.json';

export const japaneseCards: ICard[] = [
  ...AA,
  ...P,

  ...BT1,
  ...BT2,
  ...BT3,
  ...BT4,
  ...BT5,
  ...BT6,
  ...BT7,
  ...BT8,
  ...BT9,
  ...BT10,
  ...BT11,
  ...BT12,

  ...EX1,
  ...EX2,
  ...EX3,
  ...EX4,

  ...RB01,

  ...ST1,
  ...ST2,
  ...ST3,
  ...ST4,
  ...ST5,
  ...ST6,
  ...ST7,
  ...ST8,
  ...ST9,
  ...ST10,
  ...ST12,
  ...ST13,
  ...ST14,
];
