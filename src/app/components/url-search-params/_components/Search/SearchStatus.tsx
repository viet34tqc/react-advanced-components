import { SearchIcon } from '../../_icons/SearchIcon';
import { SpinnerIcon } from '../../_icons/SpinnerIcon';

export default function SearchStatus({ searching }: { searching: boolean }) {
  return (
    <div className="absolute left-4 top-[50%] translate-y-[50%]">
      {searching ? (
        <div aria-label="searching..." className="h-fit w-fit animate-spin">
          <SpinnerIcon
            aria-hidden="true"
            width={16}
            height={16}
            className="text-gray"
          />
        </div>
      ) : (
        <SearchIcon
          aria-hidden="true"
          width={16}
          height={16}
          className="text-gray"
        />
      )}
    </div>
  );
}
