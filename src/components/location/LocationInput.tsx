import React, { useEffect, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, } from "next/navigation";
import Image from "next/image";
import { Spinner } from "../ui/spinner";


const LocationInput = (props: any) => {

  const [locationError, setLocationError]: any = useState(false)
  const [localLocation, setLocalLocation]: any = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter()

  const userLocalStorageKey: any = `${process.env.NEXT_PUBLIC_USER_INFO}`;




  useEffect(() => {
    if (pathname == "/location") {
      
      getCurrentLocation()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname == "/location"]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        async (position:any) => {
          
          const res: any = await axios.get(`${process.env.NEXT_PUBLIC_GOOGLE_CURRENT_LOCATION}?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY_CURRENT_LOCATION}`);
          let address_components:any = res?.data?.results[0];
          address_components.latitude = position?.coords?.latitude;
          address_components.longitude = position?.coords?.longitude;

          fillAddress(address_components)
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
          confirm("Location access is Blocked. Change your location settings in browser or select location manually.");
        }
      );
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`,
    libraries: ["places"]
  });

  const onLoad = (autocomplete: any) => {
    setAutocomplete(autocomplete);
  };


  const fillAddress = (place: any) => {
    let toggle = false;
    place?.address_components?.map((el: any) => {
      if (el?.types.includes("country")) {
        place.country = el?.long_name;

      } else if (el?.types.includes("administrative_area_level_1")) {
        place.state = el?.long_name;

      } else if (el?.types.includes("locality")) {
        place.city = el?.short_name;
        toggle = true;
      }

      if (!toggle) {
        place.street = (place?.street ? place?.street : "") + el?.short_name + ", ";
      }
    });
    const data = {
      location: place?.formatted_address,
      latitude: place?.latitude,
      longitude: place?.longitude,
      city: place?.city,
      state: place?.state,
      street: place?.street,
      country: place?.country
    }

  }
  const onPlaceChanged = () => {
    if (autocomplete != null) {
      const place = autocomplete?.getPlace();
      place.latitude = place?.geometry?.location?.lat();
      place.longitude = place?.geometry?.location?.lng();

      fillAddress(place);
    };
  }

  const updateLocation = async () => {
    // if (!localLocation?.longitude) {
    //   setLocationError(true)
    // } else {
    //   setValue(localLocation);
    //   if (props?.type === "business") {
    //     setLocationError(false)
    //     props?.onHide()
    //   } else {
    //     if (pathname == "/location" || isAuthenticated) {
    //       setLocationLoading(true)
    //       const address: any = [
    //         {
    //           coordinates: {
    //             type: "Point",
    //             coordinates: [
    //               localLocation?.longitude,
    //               localLocation?.latitude
    //             ]
    //           },
    //           street: localLocation?.street,
    //           city: localLocation?.city,
    //           state: localLocation?.state,
    //           country: localLocation?.country
    //         }
    //       ];
    //       const payload = {
    //         address: address
    //       };

    //       try {
    //         await editProfile(payload).then((response: any) => {
    //           if (!response?.error) {
    //             setLocationError(false)
    //             if (pathname == "/location") {
    //               updateLocationInfo(localLocation)
    //               setIsAuthenticated(true)
    //               localStorage.removeItem('userRole')
    //               localStorage.removeItem(`${process.env.NEXT_PUBLIC_USER_INTEREST}`);
    //               setLocationLoading(false)
    //               router.push('/')
    //             } else {
    //               updateLocationInfo(localLocation)
    //               const updatedUser: any = { ...user, address: address };
    //               setUser(updatedUser);
    //               setLocalStorage(updatedUser, userLocalStorageKey);
    //               setLocationLoading(false)
    //               setIsLocationUpdate(localLocation?.location)
    //               props?.onHide();
    //             }
    //           }
    //         })
    //       } catch (e: any) {
    //         setLocationLoading(false)
    //       }
    //     } else {
    //       updateLocationInfo(localLocation)
    //       setIsLocationUpdate(localLocation?.location)
    //       props?.onHide();
    //     }
    //   }
    // }
  };

 
  return (
    <>

{isLoaded ? (
                  <Autocomplete
   
                    fields={[
                      "formatted_address",
                      "place_id",
                      "geometry",
                      "name",
                      "address_components"
                    ]}
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}>
                    <Input
                      id="mapInputId"
                      name="location"
                      style={{ width: '100%' }}
                      value={localLocation?.location}
                      onChange={(e: any) => {
                        setLocalLocation({
                          location: e.target.value
                        })
                      }
                      }
                      placeholder={'location'}
                    />
                  </Autocomplete>
                ) : (
                  ""
                )}
                </>
  );

}
export default LocationInput;
