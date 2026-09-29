import { useMemo } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import {
  CheckCircledIcon,
  Cross2Icon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import type { VariantProps } from 'class-variance-authority';
import Button from '#/Atoms/Button/Button';
import Icon from '#/Atoms/Icon/Icon';
import { useThemedPortalProps } from '#/ThemeProvider/ThemedPortal';
import {
  toastActionsCss,
  toastContentCss,
  toastDescriptionCss,
  toastIconCss,
  toastTitleCss,
  toastVariant,
  toastViewportCss,
} from './Toast.style';

export type ToastTone = NonNullable<VariantProps<typeof toastVariant>['tone']>;

export type ToastOptions = {
  /** Reusing the id of an open toast updates it in place. */
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Colour and icon. Defaults to `neutral`. */
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss; `0` keeps it open. Defaults to the `Toast` `timeout`. */
  timeout?: number;
  /**
   * `high` announces the toast immediately (assertive), `low` politely.
   * Defaults to `high` for `danger`, `low` otherwise.
   */
  priority?: 'low' | 'high';
  /** Renders one button next to the message, e.g. "Undo". */
  action?: { label: React.ReactNode; onClick: () => void };
  /** Called when the toast closes, whether dismissed or timed out. */
  onClose?: () => void;
};

export type ToastApi = {
  /** Shows a toast and returns its id. */
  add: (options: ToastOptions) => string;
  /** Closes one toast, or all of them when no id is given. */
  close: (id?: string) => void;
};

export type ToastManager = ToastApi & {
  /** @internal The Base UI manager the `Toast` provider subscribes to. */
  readonly baseManager: ReturnType<typeof BaseToast.createToastManager>;
};

export type ToastProps = {
  children: React.ReactNode;
  /** Default milliseconds before auto-dismiss; `0` disables it. */
  timeout?: number;
  /** How many toasts show at once; older ones wait hidden. */
  limit?: number;
  /** A manager from `Toast.createManager()`, to show toasts from outside React. */
  manager?: ToastManager;
  /** Accessible name of each toast's dismiss button. */
  dismissLabel?: string;
};

const toneIcons: Record<ToastTone, React.ReactNode> = {
  neutral: null,
  info: <InfoCircledIcon />,
  success: <CheckCircledIcon />,
  warning: <ExclamationTriangleIcon />,
  danger: <CrossCircledIcon />,
};

function toBaseOptions(options: ToastOptions) {
  const { tone = 'neutral', priority, action, ...restOptions } = options;

  return {
    ...restOptions,
    type: tone,
    priority: priority ?? (tone === 'danger' ? 'high' : 'low'),
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  } as const;
}

function isTone(type: string | undefined): type is ToastTone {
  return type !== undefined && type in toneIcons;
}

/**
 * Hosts toasts for everything inside it: wrap the app (inside `ThemeProvider`)
 * once, then show toasts with `Toast.useToast()` or a `Toast.createManager()`
 * manager. Toasts stack in the bottom corner, pause while hovered or focused,
 * can be swiped away, and F6 moves focus to them.
 */
function Toast(props: ToastProps) {
  const { children, timeout, limit, manager, dismissLabel = 'Dismiss' } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseToast.Provider timeout={timeout} limit={limit} toastManager={manager?.baseManager}>
      {children}
      <BaseToast.Portal {...themedPortalProps}>
        <BaseToast.Viewport className={toastViewportCss}>
          <ToastList dismissLabel={dismissLabel} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList(props: { dismissLabel: string }) {
  const { dismissLabel } = props;
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => {
    const tone = isTone(toast.type) ? toast.type : 'neutral';
    const icon = toneIcons[tone];

    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        swipeDirection={['right', 'down']}
        className={toastVariant({ tone })}
      >
        {icon && (
          <Icon size="md" className={toastIconCss}>
            {icon}
          </Icon>
        )}
        <BaseToast.Content className={toastContentCss}>
          <BaseToast.Title className={toastTitleCss} />
          <BaseToast.Description className={toastDescriptionCss} />
        </BaseToast.Content>
        <div className={toastActionsCss}>
          {toast.actionProps && (
            <BaseToast.Action render={<Button variant="secondary" size="sm" />} />
          )}
          <BaseToast.Close render={<Button variant="ghost" size="sm" />} aria-label={dismissLabel}>
            <Button.Icon>
              <Cross2Icon />
            </Button.Icon>
          </BaseToast.Close>
        </div>
      </BaseToast.Root>
    );
  });
}

/** Shows and closes toasts from a component inside `Toast`. */
function useToast(): ToastApi {
  const { add, close } = BaseToast.useToastManager();

  return useMemo(
    () => ({
      add: (options: ToastOptions) => add(toBaseOptions(options)),
      close,
    }),
    [add, close],
  );
}

/**
 * Creates a manager to show toasts from anywhere, including outside React
 * (e.g. a data-fetching layer). Pass it to `Toast` as `manager`.
 */
function createManager(): ToastManager {
  const baseManager = BaseToast.createToastManager();

  return {
    baseManager,
    add: (options) => baseManager.add(toBaseOptions(options)),
    close: (id) => baseManager.close(id),
  };
}

Toast.useToast = useToast;
Toast.createManager = createManager;

export default Toast;
