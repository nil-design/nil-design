import { FC, cloneElement } from 'react';
import { mergeProps, registerSlots } from '../_shared/utils';
import Modal from '../modal';
import { isBodyElement } from '../modal/Body';
import { isCloseElement } from '../modal/Close';
import { isFooterElement } from '../modal/Footer';
import { isHeaderElement } from '../modal/Header';
import { isPortalElement } from '../modal/Portal';
import variants from '../modal/style';
import { isTriggerElement } from '../modal/Trigger';
import { DialogProps } from './interfaces';

const collectSlots = registerSlots({
    trigger: { isMatched: child => isTriggerElement(child) },
    portal: { isMatched: child => isPortalElement(child) },
    header: { isMatched: child => isHeaderElement(child) },
    body: { isMatched: child => isBodyElement(child) },
    footer: { isMatched: child => isFooterElement(child) },
    close: { isMatched: child => isCloseElement(child) },
    firstBare: {
        isMatched: child =>
            !isTriggerElement(child) &&
            !isPortalElement(child) &&
            !isHeaderElement(child) &&
            !isBodyElement(child) &&
            !isFooterElement(child) &&
            !isCloseElement(child),
        strategy: 'first',
    },
});

const Dialog: FC<DialogProps> = ({ children, ...restProps }) => {
    const { slots } = collectSlots(children);
    const { slots: portalSlots } = collectSlots(slots.portal.el?.props.children);

    return (
        <Modal placement="center" {...restProps}>
            {slots.trigger.el ?? (slots.firstBare.el && <Modal.Trigger>{slots.firstBare.el}</Modal.Trigger>)}
            {slots.portal.el &&
                cloneElement(
                    slots.portal.el,
                    undefined,
                    <>
                        {portalSlots.header.el
                            ? cloneElement(
                                  portalSlots.header.el,
                                  mergeProps(portalSlots.header.el.props, {
                                      className: portalSlots.close.el ? variants.closableHeader() : undefined,
                                  }),
                              )
                            : null}
                        {portalSlots.body.el}
                        {portalSlots.footer.el}
                        {portalSlots.close.el}
                    </>,
                )}
        </Modal>
    );
};

Dialog.displayName = 'Dialog';

export default Dialog;
