import AddEventForm from '@/components/forms/AddEventForm.tsx';

export const AddEventPage = () => {
  return (
    <div className="mt-5">
      <p className="my-2 text-center text-xl font-bold">Dodawanie wydarzenia</p>
      <div className="flex">
        <div className="mx-auto">
          <AddEventForm />
        </div>
      </div>
    </div>
  );
};
