import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import { topicRequiredToText } from '../../../../../../utils/convert';

interface Props {
  values?: any;
  setValues: (values: any) => void;
}

const TopicDropdown = ({ values, setValues }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <div className="relative w-32">
      <div
        className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2"
        id="link-contents"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        <span className="text-sm">
          {topicRequiredToText[values?.topic] || '없음'}
        </span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuShown && (
        <ul className="absolute bottom-0 z-50 w-full translate-y-[calc(100%+0.25rem)] overflow-hidden rounded-lg border border-[#A3A3A3] bg-white">
          {Object.keys(topicRequiredToText).map((topic: any, index: number) => (
            <li
              key={index}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setValues({ ...values, topic: topic });
                setIsMenuShown(false);
              }}
            >
              {topicRequiredToText[topic]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicDropdown;