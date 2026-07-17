// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Modal from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Modal', () => {
    bench('mounts and unmounts an open dialog', () => {
        mount(
            <Modal aria-label="Benchmark dialog" open>
                <Modal.Portal>
                    <Modal.Header>Title</Modal.Header>
                    <Modal.Body>Dialog content</Modal.Body>
                    <Modal.Footer>
                        <Modal.Close>Close</Modal.Close>
                    </Modal.Footer>
                </Modal.Portal>
            </Modal>,
        );
    });
});
