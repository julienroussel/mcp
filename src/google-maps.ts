import 'dotenv/config';
import { z } from 'zod';

const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api';

const GoogleMapsResponseSchema = z.object({
  status: z.string(),
  error_message: z.string().optional(),
});

const GeocodeResultSchema = z.object({
  results: z.array(
    z.object({
      place_id: z.string(),
      formatted_address: z.string(),
      geometry: z.object({
        location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      }),
      address_components: z.array(
        z.object({
          long_name: z.string(),
          short_name: z.string(),
          types: z.string().array(),
        }),
      ),
    }),
  ),
});

const GeocodeResponseSchema =
  GoogleMapsResponseSchema.merge(GeocodeResultSchema);

const getApiKey = (): string => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY environment variable is not set');
    process.exit(1);
  }
  return apiKey;
};

const GOOGLE_MAPS_API_KEY = getApiKey();

export const AddressSchema = {
  address: z.string().describe('The address to geocode'),
};
const AddressSchemaObject = z.object(AddressSchema);
type Address = z.infer<typeof AddressSchemaObject>;

export const handleGeocode = async ({ address }: Address) => {
  const url = new URL(`${GOOGLE_MAPS_URL}/geocode/json`);
  url.searchParams.append('address', address);
  url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

  const response = await fetch(url.toString());
  const data = GeocodeResponseSchema.parse(await response.json());

  const hasError = data.status !== 'OK';

  return {
    hasError,
    content: hasError
      ? `Geocoding failed: ${data.error_message || data.status}`
      : JSON.stringify(
          {
            location: data.results[0].geometry.location,
            formatted_address: data.results[0].formatted_address,
            place_id: data.results[0].place_id,
          },
          null,
          2,
        ),
  };
};
