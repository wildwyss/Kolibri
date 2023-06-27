
// TODO: for some reason, nil must be imported before Sequence, even if we don't use it, when using Promises
import {nil}                                     from "../../sequence/constructors/nil/nil.js"; // do not remove
import {Sequence}                                          from "../../sequence/constructors/sequence/Sequence.js";
import {action, intersperse, iterateAsync, keepEven, wait} from "../util.js";
import {map}                                               from "../../sequence/operators/map/map.js";
import {take}                                    from "../../sequence/operators/take/take.js";
import {drop}                                    from "../../sequence/operators/drop/drop.js";

export { start }

/**
 * cmp https://github.com/Dierk/frepl-gui/blob/master/Stairs.fr
 * @param { HTMLCanvasElement } canvasElement
 */
const start = canvasElement => {

    // pure production
    const Point   = (x,y)     => ({x,y});
    const Trail   = (a,b,c,d) => ({a,b,c,d});
    const start   = Trail( Point(-10,10), Point(-10,-10), Point(10,-10), Point(9.5,9.5) );
    const forever = _p => true;
    const bearing = from => over => Point( from.x + (over.x-from.x)*1.05, from.y + (over.y-from.y)*1.05);
    const step    = ({a,b,c,d})  => Trail(bearing(a)(d), a, b, c );
    const trails  = Sequence(start, forever, step);

    const ctx        = canvasElement.getContext('2d');
    const centerx    = canvasElement.width  / 2;
    const centery    = canvasElement.height / 2;
    const drawAction = action ( ({a,b}) => {
        ctx.moveTo(centerx + a.x, centery + a.y);
        ctx.lineTo(centerx + b.x, centery + b.y);
        ctx.stroke();
    })  ;
    const doodle = map (drawAction) (trails);

    // consumption with customizable effect
    iterateAsync ( doodle.pipe (
        // comment / uncomment / modify to see various effects
        drop (5),
        take (300),
        // keepEven,
        intersperse (wait(20))
    ) );
};
