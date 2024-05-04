import { useState } from 'react';
import { getEvents } from '@/utils/api/api';
import { Event } from './Event';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/utils/context/store';
import {
  PagingSlice,
  selectCurrentPage,
} from '@/utils/context/paging/pagingSlice';
import { selectSearch } from '@/utils/context/searchSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EventMini } from '@/components/events/EventMini.tsx';
import { Icon } from 'leaflet';
import { PaginationComponent } from '@/components/events/PaginationComponent.tsx';

const customMarkerIcon = new Icon({
  iconUrl:
    'https://www.flaticon.com/download/icon/5772805?icon_id=5772805&author=203&team=203&keyword=Accountable&pack=5772568&style=Filled&style_id=2&format=png&color=%23000000&colored=1&size=512&selection=1&type=standard&token=03AFcWeA5BVu0falzRxJypnHb9TH7Ue_NYbSyjUN96nwh6cl2U6FSzhmVVE5OI7YoC_gK2OJ5xovTPeUTWQnvclgMsCTnxDDs_jg324_SDwesfBE512jsC3Uhbk4E-oaxryFn-d1Vpag0zWjjUyaoqpKEYmANREKnU9JYjeO3DCrq-E5_zFGLpSdhqKBGJ2BivEOLdOfCPGOFRIGDAhmqdGmy3azs1iURm08TslN6lsJolXuLvfdoHx0Er9NN0TMBWE3eRjG7y7V2uuj_8I_mXm3A-Jk-bUnln6BSkzaY-lTgC-YBOQ0CH7peLtxDbKAbXhubeidciDGMMh4VVGhNJPovQWyZ5-07Gp3C0KMDyaKG24dS3kHGXr1_4YKvD8nmy00YWFxJP-K-aEEKk6S8w1kxXJu8tC9UscksuR019j-yuJH6HSKWJbOJ6VM_sbI4Lh2WYfndNSQqcYUuY_d31n_UPql4R3HNw1GfpwCwbXzbjbVkr_UI5VQOH4MhJ9IBCGMCsyEqgLuwBh2yMeiNbSm2EEla-gXl1AbqH9mAw-vkWZB5V-WitS4b1G7VDtV6_WRBNij1Y6DfAb6ahK81TAbh14fDyeOkVZ2UoKSBopRQaoCetIcTdc5etT8O-YRWsXgdpvcA0OZ3eDMbYhM9uyra48eaABF-G_qzzSVD2mIUGzS9ylGnnUzxP4R_F96wRDsWtU2ItztpW_Fk3m8mVPKCK2lmGaqa6F-VAXSc3GKUiSOfPZCI521tY72kvMuyAAFn6R2TiPQeJ2H5FPdJTQOX_6TshWCvBBh3x_wYG3NoFZT_Oj2nFxwT6Hy9fjtLHEtcuxULMeW1E_5Zr-pehI7iLoHNnULAWsJEjWHnmkvMPmANrkT_HWs73_kNrg9b0SHR1bmHaQIUGadVpsPmFRj1XgMp0dOmkgYNdPmBdxjuO733c7WeL2kYtYkzxXq5txonRHDjOQB1obMC1KwDQPbjkgWTlcyQGdTqEkmsQ40rJHIzu_80rUHI9IktgcQcHP5p4u3aFlpMrHuJUo1X40p5Fp0eAYQgNirbdncptrp5dS4WJ-JGT547VAiWO-PYodij2SCkBeNru6BhBxOdXTnRgmlO3nAj7whCepONgtfC2Hci4lPX-9Il5E2p0DGr7ZSuxiscSfCJGHcFDwfqU3LKZ8LD0zEpbnJtUwnRPceqOd11wIuWb0olFqU8RYPKA9AP_U0ZvEoDPJ3uGbXGdwjBYO4OhY2iJL5odaQ84yQolmYu_em-xPi5eWUS-gBQ8zJI0ygzKE9atg2a9-rrZnyCoWKIgiV4ZZhSMDIPuOoXTdJ7cjB755fNR0DNkBqNDKDTDr2LpnkfgOgIZl0BFXxEtPFG9okNidrEaP5De4iZXLGD2wUV9KGvLCbYcKvS2w6r4cwWi5j_Le5ZKNHFjku9qGhxXcl3TbYbPYvHTI3u4JKUf9VqNJbRSkiNOzU2LI0jY4OQcLKQXufioRXVJErI1VQJsSgWGaQycZwQmxlAGsUU-zvEJr3BmLeqOKYCx1-0WqfajDPzSr1C3dk29WWh2YjvtU8NpCw_QBW0iGZUoEpjCdgADAuWPWN72eivc9K9cXwtb7H8AsIdEaJhVlM2D_SWrLqLlPcKRZomARroobVh7DK03eSUxaGzpsXLhMKzu_FdrvvnyOEz1QQUdBIPJo723J5tC2g&search=volunt&search=volunt',
  iconSize: [24, 24], // Rozmiar ikony
});

export const EventList = () => {
  const dispatch = useAppDispatch();
  const page = selectCurrentPage(useAppSelector((state) => state)) - 1;
  const search = selectSearch(useAppSelector((state) => state));
  const { data, isError, isPending, isSuccess } = useQuery({
    queryKey: ['events', { page, search }],
    queryFn: () => getEvents(page, search),
    // initialData: {},
  });

  const [showMap, setShowMap] = useState(false);

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  if (isPending)
    return (
      <div className="flex justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );

  if (isError || data.content.length === 0)
    return <div>Nie znaleziono żadnych wydarzeń.</div>;

  if (isSuccess) {
    dispatch({
      type: PagingSlice.actions.setCurrentPage.type,
      payload: data.number + 1,
    });
    dispatch({
      type: PagingSlice.actions.setTotalPages.type,
      payload: data.totalPages,
    });
    dispatch({
      type: PagingSlice.actions.setIsFirstPage.type,
      payload: data.first,
    });
    dispatch({
      type: PagingSlice.actions.setIsLastPage.type,
      payload: data.last,
    });
  }

  return (
    <>
      <button onClick={toggleView}>
        {showMap ? 'Pokaż listę' : 'Pokaż mapę'}
      </button>
      {showMap && (
        <MapContainer center={[51.505, 19]} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Renderowanie markerów dla wydarzeń */}
          {data.content.map((event) => {
            const latitude = parseFloat(event.location.latitude || '');
            const longitude = parseFloat(event.location.longitude || '');
            if (!isNaN(latitude) && !isNaN(longitude)) {
              return (
                <Marker
                  key={event.id}
                  position={[latitude, longitude]}
                  icon={customMarkerIcon}
                >
                  <Popup>
                    <EventMini event={event} />
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      )}
      {!showMap && (
        <div className="flex flex-col gap-5">
          {data.content.map((event) => (
            <Event key={event.id} event={event} />
          ))}
          <PaginationComponent />
        </div>
      )}
    </>
  );
};
