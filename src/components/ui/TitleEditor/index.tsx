import * as React from 'react';
import { TextInput, Button, Icon } from '@tremor/react';
import { RiCheckFill, RiCloseFill, RiPencilFill } from '@remixicon/react';
import { Heading } from '../Heading';

type Props = {
  title: string;
  onSaveTitle?: (newTitle: string) => void;
  titleSize?: 'h1' | 'h2';
};

export function TitleEditor({
  title,
  onSaveTitle,
  titleSize = 'h1',
}: Props): JSX.Element {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState(title);

  return (
    <div className="flex items-center">
      {isEditingTitle ? (
        <form className="flex" onSubmit={(event) => event.preventDefault()}>
          <TextInput
            className="mr-2 w-fit"
            placeholder="Set title..."
            onValueChange={setTempTitle}
            value={tempTitle}
          />
          <Button
            variant="light"
            type="submit"
            onClick={() => {
              setIsEditingTitle(false);
              if (onSaveTitle) {
                onSaveTitle(tempTitle);
              }
            }}
          >
            <Icon
              icon={RiCheckFill}
              variant="simple"
              size="sm"
              tooltip="Save"
            />
          </Button>
          <Button
            variant="light"
            onClick={() => {
              setIsEditingTitle(false);
              setTempTitle(title); // reset the title
            }}
          >
            <Icon
              icon={RiCloseFill}
              variant="simple"
              size="sm"
              tooltip="Cancel"
            />
          </Button>
        </form>
      ) : (
        <>
          <Heading size={titleSize}>{title}</Heading>
          <Button
            className="ml-2"
            variant="light"
            onClick={() => setIsEditingTitle(true)}
          >
            <Icon
              icon={RiPencilFill}
              variant="simple"
              size="sm"
              tooltip="Edit"
            />
          </Button>
        </>
      )}
    </div>
  );
}
