import AddEventForm from "@/components/forms/AddEventForm.tsx";

export const AddEventPage = () => {
    return (
        <div className="relative">
            <p className="text-center font-bold my-2 text-xl">Dodawanie wydarzenia</p>
            <div className="flex">
                <div className="mx-auto">
                    <AddEventForm/>
                </div>
            </div>
        </div>
    );
};
