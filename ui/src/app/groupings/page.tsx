import GroupingsTable from '@/components/table/groupings-table';
import { ownerGroupings } from '@/actions/groupings-api';

const Groupings = async () => {
    const { groupingPaths } = await ownerGroupings();

    return (
        <div className="bg-white">
            <div className="container">
                <GroupingsTable groupingPaths={groupingPaths} />
            </div>
        </div>
    );
};

export default Groupings;
