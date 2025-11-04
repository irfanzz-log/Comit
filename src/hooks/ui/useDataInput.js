import useDateFilter from "./useDateFilter"

export default function useDataInput(input) {
    const dataFilter = useDateFilter(input.keyStart, input.keyEnd);

    return (
        dataFilter
    )
}