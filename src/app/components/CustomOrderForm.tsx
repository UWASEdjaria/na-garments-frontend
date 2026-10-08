'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';

import CustomOrderInput from './CustomOrderInput';
import CustomOrderTextarea from './custom-order/CustomOrderTextarea';
import useCustomOrderForm from '@/app/hooks/useCustomOrderForm';
import { cloudinaryService } from '@/app/services/cloudinary.service';

export default function CustomOrderForm() {
  const {
    formData,
    isSubmitting,
    successMessage,
    errorMessage,
    handleInputChange,
    handleTextareaChange,
    handleSubmit,
  } = useCustomOrderForm();

  const [imageUrl, setImageUrl] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [changingImageIndex, setChangingImageIndex] =
    useState<number | null>(null);

  const addImagesInputRef = useRef<HTMLInputElement>(null);
  const changeImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setImageUrl(event.target.value);
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) return;

    setReferenceImages((current) => [
      ...current,
      trimmedUrl,
    ]);

    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setReferenceImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) =>
          cloudinaryService.uploadImage(file)
        )
      );

      if (changingImageIndex !== null) {
        setReferenceImages((current) =>
          current.map((url, index) =>
            index === changingImageIndex
              ? uploadedUrls[0]
              : url
          )
        );

        setChangingImageIndex(null);
      } else {
        setReferenceImages((current) => [
          ...current,
          ...uploadedUrls,
        ]);
      }
    } catch (error) {
      console.error(
        'Failed to upload reference image:',
        error
      );
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleChangeImage = (index: number) => {
    setChangingImageIndex(index);
    changeImageInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#123B5D] mb-2">
          Tell Us What You Need
        </h2>

        <p className="text-gray-600 text-sm">
          Complete the form below and our team will review your
          custom order request.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            <div>
              <h3 className="font-semibold text-[#123B5D]">
                Request Received!
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Thank you for choosing NA-GARMENTS. We have received your
                custom order request and our team will review it shortly.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                We will contact you with more details and a quote.
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={(event) =>
          handleSubmit(event, referenceImages)
        }
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomOrderInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />

          <CustomOrderInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />

          <CustomOrderInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+250 7XX XXX XXX"
            required
          />

          <CustomOrderInput
            label="Garment Type"
            name="garmentType"
            value={formData.garmentType}
            onChange={handleInputChange}
            placeholder="e.g. Men's suit, shirts, uniforms"
            required
          />

          <CustomOrderInput
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            min={1}
            required
          />
        </div>

        <CustomOrderTextarea
          label="Measurements"
          name="measurements"
          value={formData.measurements}
          onChange={handleTextareaChange}
          placeholder="Provide your measurements if available..."
          rows={4}
        />

        <CustomOrderTextarea
          label="Describe Your Order"
          name="description"
          value={formData.description}
          onChange={handleTextareaChange}
          placeholder="Tell us about the garment you want, style, fabric, color, and other important details..."
          required
          rows={5}
        />

        <CustomOrderTextarea
          label="Additional Requirements"
          name="additionalReqs"
          value={formData.additionalReqs}
          onChange={handleTextareaChange}
          placeholder="Any additional requirements or preferences?"
          rows={4}
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#123B5D] mb-2">
              Reference / Inspiration Images
              <span className="ml-1 font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <p className="text-sm text-gray-500 mb-4">
              Upload images or add an image URL to help us understand your
              design.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 cursor-pointer rounded-md border-2 border-dashed border-gray-300 px-4 py-4 text-center transition-colors hover:border-[#F28C28]">
                <span className="text-sm font-semibold text-[#123B5D]">
                  {isUploading
                    ? 'Uploading...'
                    : 'Choose Images'}
                </span>

                <input
                  ref={addImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex flex-1 gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Paste image URL"
                  className="text-gray-500 min-w-0 flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#F28C28]"
                />

                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="rounded-md bg-[#123B5D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#F28C28] hover:text-[#111111]"
                >
                  Add
                </button>
              </div>
            </div>

            <input
              ref={changeImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {referenceImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {referenceImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-[#EEF3F6]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Reference image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute right-2 top-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleChangeImage(index)
                      }
                      disabled={isUploading}
                      className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#123B5D] shadow-md transition-colors hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(index)
                      }
                      disabled={isUploading}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-sm font-bold text-red-600 shadow-md transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Remove reference image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full sm:w-auto bg-[#F28C28] text-[#111111] hover:bg-[#123B5D] hover:text-white font-bold px-8 py-3 rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading
            ? 'Uploading Images...'
            : isSubmitting
              ? 'Submitting...'
              : 'Request a Quote'}
        </button>
      </form>
    </div>
  );
}